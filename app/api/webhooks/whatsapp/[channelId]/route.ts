import { NextRequest, NextResponse } from 'next/server';
import { incomingQ } from '@/lib/queue';
import { open } from '@/lib/crypto';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Función para verificar la firma de Meta
function verifyMetaSignature(body: string, signature: string, appSecret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(body)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature.replace('sha256=', ''), 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('[WhatsApp] Error verificando firma:', error);
    return false;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode !== 'subscribe' || !token || !challenge) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }

    // Obtener el canal y verificar el token
    const channel = await prisma.channel.findUnique({
      where: { id: params.channelId }
    });

    if (!channel || channel.type !== 'whatsapp_cloud') {
      return NextResponse.json({ error: 'Canal no encontrado' }, { status: 404 });
    }

    // Desencriptar verify token
    const decryptedToken = open(channel.verifyToken!);
    
    if (token !== decryptedToken) {
      console.warn(`[WhatsApp] Token de verificación inválido para canal ${params.channelId}`);
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
    }

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: channel.userId,
        action: 'webhook_verify',
        resource: 'whatsapp_webhook',
        resourceId: params.channelId,
        changes: { mode, challenge }
      }
    });

    console.log(`[WhatsApp] Webhook verificado para canal ${params.channelId}`);
    return new NextResponse(challenge, { status: 200 });

  } catch (error) {
    console.error('[WhatsApp] Error en verificación:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const channelId = params.channelId;
    const body = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    if (!signature) {
      console.warn(`[WhatsApp] Firma faltante para canal ${channelId}`);
      return NextResponse.json({ error: 'Firma requerida' }, { status: 401 });
    }

    // Obtener el canal
    const channel = await prisma.channel.findUnique({
      where: { id: channelId }
    });

    if (!channel || channel.type !== 'whatsapp_cloud' || !channel.isActive) {
      return NextResponse.json({ error: 'Canal no encontrado o inactivo' }, { status: 404 });
    }

    // Desencriptar app secret
    const appSecret = open(channel.appSecret!);
    
    // Verificar firma
    if (!verifyMetaSignature(body, signature, appSecret)) {
      console.warn(`[WhatsApp] Firma inválida para canal ${channelId}`);
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
    }

    const data = JSON.parse(body);
    
    // Verificar que es un mensaje válido
    if (!data.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      // No es un mensaje, responder OK (puede ser status update)
      return NextResponse.json({ status: 'ok' });
    }

    const message = data.entry[0].changes[0].value.messages[0];
    const from = message.from;
    const text = message.text?.body || '';
    const messageId = message.id;

    // Verificar idempotencia usando message.id
    const existingJob = await incomingQ.getJob(messageId);
    if (existingJob) {
      console.log(`[WhatsApp] Mensaje duplicado ${messageId}, descartando`);
      return NextResponse.json({ status: 'ok' });
    }

    // Obtener el bot asociado al canal
    const bot = await prisma.bot.findFirst({
      where: { 
        id: channel.botId!,
        status: 'live'
      }
    });

    if (!bot) {
      console.warn(`[WhatsApp] Bot no encontrado o inactivo para canal ${channelId}`);
      return NextResponse.json({ error: 'Bot no configurado' }, { status: 400 });
    }

    // Desencriptar access token
    const accessToken = open(channel.accessToken!);

    // Encolar el mensaje para procesamiento
    await incomingQ.add('incoming', {
      botId: bot.id,
      channelId: channelId,
      channelType: 'whatsapp',
      externalUserId: from,
      text: text,
      phoneNumberId: channel.phoneNumberId,
      accessToken: accessToken
    }, {
      jobId: messageId, // Usar message.id para idempotencia
      removeOnComplete: true,
      removeOnFail: false
    });

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: channel.userId,
        action: 'message_received',
        resource: 'whatsapp_webhook',
        resourceId: channelId,
        changes: { from, text: text.substring(0, 100), messageId }
      }
    });

    console.log(`[WhatsApp] Mensaje encolado para canal ${channelId}, usuario ${from}`);
    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('[WhatsApp] Error procesando mensaje:', error);
    
    // Log del error
    try {
      await prisma.errorEvent.create({
        data: {
          component: 'whatsapp_webhook',
          code: 'PROCESSING_ERROR',
          message: error.message,
          reqId: params.channelId
        }
      });
    } catch (logError) {
      console.error('[WhatsApp] Error loggeando error:', logError);
    }

    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

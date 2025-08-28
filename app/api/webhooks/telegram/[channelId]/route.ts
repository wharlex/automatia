import { NextRequest, NextResponse } from 'next/server';
import { incomingQ } from '@/lib/queue';
import { open } from '@/lib/crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const channelId = params.channelId;
    
    // Obtener el canal
    const channel = await prisma.channel.findUnique({
      where: { id: channelId }
    });

    if (!channel || channel.type !== 'telegram') {
      return NextResponse.json({ error: 'Canal no encontrado' }, { status: 404 });
    }

    // Desencriptar bot token
    const botToken = open(channel.botToken!);
    
    // Verificar que el bot existe
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    if (!response.ok) {
      return NextResponse.json({ error: 'Bot token inválido' }, { status: 400 });
    }

    const botInfo = await response.json();
    
    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: channel.userId,
        action: 'webhook_status',
        resource: 'telegram_webhook',
        resourceId: channelId,
        changes: { botUsername: botInfo.result?.username }
      }
    });

    return NextResponse.json({
      status: 'ok',
      bot: botInfo.result,
      webhookUrl: channel.webhookUrl
    });

  } catch (error) {
    console.error('[Telegram] Error verificando webhook:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const channelId = params.channelId;
    const body = await req.json();
    
    // Verificar que es un mensaje válido
    if (!body.message && !body.callback_query) {
      return NextResponse.json({ status: 'ok' });
    }

    // Obtener el canal
    const channel = await prisma.channel.findUnique({
      where: { id: channelId }
    });

    if (!channel || channel.type !== 'telegram' || !channel.isActive) {
      return NextResponse.json({ error: 'Canal no encontrado o inactivo' }, { status: 404 });
    }

    // Desencriptar bot token
    const botToken = open(channel.botToken!);

    let externalUserId: string;
    let text: string;
    let messageId: string;

    if (body.message) {
      // Mensaje de texto
      const message = body.message;
      externalUserId = message.from.id.toString();
      text = message.text || '';
      messageId = message.message_id.toString();
    } else if (body.callback_query) {
      // Callback query (botones inline)
      const callback = body.callback_query;
      externalUserId = callback.from.id.toString();
      text = callback.data || '';
      messageId = callback.id.toString();
    } else {
      return NextResponse.json({ status: 'ok' });
    }

    // Verificar idempotencia usando messageId
    const existingJob = await incomingQ.getJob(messageId);
    if (existingJob) {
      console.log(`[Telegram] Mensaje duplicado ${messageId}, descartando`);
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
      console.warn(`[Telegram] Bot no encontrado o inactivo para canal ${channelId}`);
      return NextResponse.json({ error: 'Bot no configurado' }, { status: 400 });
    }

    // Encolar el mensaje para procesamiento
    await incomingQ.add('incoming', {
      botId: bot.id,
      channelId: channelId,
      channelType: 'telegram',
      externalUserId: externalUserId,
      text: text,
      botToken: botToken
    }, {
      jobId: messageId, // Usar messageId para idempotencia
      removeOnComplete: true,
      removeOnFail: false
    });

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: channel.userId,
        action: 'message_received',
        resource: 'telegram_webhook',
        resourceId: channelId,
        changes: { 
          from: externalUserId, 
          text: text.substring(0, 100), 
          messageId,
          type: body.message ? 'message' : 'callback_query'
        }
      }
    });

    console.log(`[Telegram] Mensaje encolado para canal ${channelId}, usuario ${externalUserId}`);
    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('[Telegram] Error procesando mensaje:', error);
    
    // Log del error
    try {
      await prisma.errorEvent.create({
        data: {
          component: 'telegram_webhook',
          code: 'PROCESSING_ERROR',
          message: error.message,
          reqId: params.channelId
        }
      });
    } catch (logError) {
      console.error('[Telegram] Error loggeando error:', logError);
    }

    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

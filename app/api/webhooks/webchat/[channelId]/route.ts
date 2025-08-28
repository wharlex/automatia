import { NextRequest, NextResponse } from 'next/server';
import { incomingQ } from '@/lib/queue';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const channelId = params.channelId;
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    // Obtener el canal
    const channel = await prisma.channel.findUnique({
      where: { id: channelId }
    });

    if (!channel || channel.type !== 'webchat') {
      return NextResponse.json({ error: 'Canal no encontrado' }, { status: 404 });
    }

    if (action === 'status') {
      // Verificar estado del canal
      return NextResponse.json({
        status: 'ok',
        channel: {
          id: channel.id,
          isActive: channel.isActive,
          publicSlug: channel.publicSlug
        }
      });
    }

    // Por defecto, mostrar información del canal
    return NextResponse.json({
      status: 'ok',
      channel: {
        id: channel.id,
        type: channel.type,
        isActive: channel.isActive,
        publicSlug: channel.publicSlug
      }
    });

  } catch (error) {
    console.error('[Webchat] Error en GET:', error);
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
    
    const { text, externalUserId, sessionId } = body;
    
    if (!text) {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }

    // Obtener el canal
    const channel = await prisma.channel.findUnique({
      where: { id: channelId }
    });

    if (!channel || channel.type !== 'webchat' || !channel.isActive) {
      return NextResponse.json({ error: 'Canal no encontrado o inactivo' }, { status: 404 });
    }

    // Generar o usar externalUserId
    const userId = externalUserId || `webchat_${sessionId || Date.now()}`;
    
    // Generar messageId único para idempotencia
    const messageId = `webchat_${channelId}_${userId}_${Date.now()}`;

    // Verificar idempotencia
    const existingJob = await incomingQ.getJob(messageId);
    if (existingJob) {
      console.log(`[Webchat] Mensaje duplicado ${messageId}, descartando`);
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
      console.warn(`[Webchat] Bot no encontrado o inactivo para canal ${channelId}`);
      return NextResponse.json({ error: 'Bot no configurado' }, { status: 400 });
    }

    // Encolar el mensaje para procesamiento
    await incomingQ.add('incoming', {
      botId: bot.id,
      channelId: channelId,
      channelType: 'webchat',
      externalUserId: userId,
      text: text,
      publicSlug: channel.publicSlug
    }, {
      jobId: messageId,
      removeOnComplete: true,
      removeOnFail: false
    });

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: channel.userId,
        action: 'message_received',
        resource: 'webchat_webhook',
        resourceId: channelId,
        changes: { 
          from: userId, 
          text: text.substring(0, 100), 
          messageId,
          sessionId: sessionId || 'anonymous'
        }
      }
    });

    console.log(`[Webchat] Mensaje encolado para canal ${channelId}, usuario ${userId}`);
    return NextResponse.json({ 
      status: 'ok',
      messageId,
      userId
    });

  } catch (error) {
    console.error('[Webchat] Error procesando mensaje:', error);
    
    // Log del error
    try {
      await prisma.errorEvent.create({
        data: {
          component: 'webchat_webhook',
          code: 'PROCESSING_ERROR',
          message: error.message,
          reqId: params.channelId
        }
      });
    } catch (logError) {
      console.error('[Webchat] Error loggeando error:', logError);
    }

    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// Endpoint para SSE (Server-Sent Events) para respuestas en tiempo real
export async function PATCH(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const channelId = params.channelId;
    const body = await req.json();
    
    const { userId, messageId } = body;
    
    if (!userId || !messageId) {
      return NextResponse.json({ error: 'userId y messageId requeridos' }, { status: 400 });
    }

    // Obtener el canal
    const channel = await prisma.channel.findUnique({
      where: { id: channelId }
    });

    if (!channel || channel.type !== 'webchat') {
      return NextResponse.json({ error: 'Canal no encontrado' }, { status: 404 });
    }

    // Buscar la respuesta del bot en la base de datos
    const botMessage = await prisma.message.findFirst({
      where: {
        botId: channel.botId!,
        channelId: channelId,
        externalUserId: userId,
        role: 'assistant',
        createdAt: {
          gte: new Date(Date.now() - 60000) // Último minuto
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!botMessage) {
      return NextResponse.json({ error: 'Respuesta no encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'ok',
      response: botMessage.content,
      timestamp: botMessage.createdAt
    });

  } catch (error) {
    console.error('[Webchat] Error en PATCH:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

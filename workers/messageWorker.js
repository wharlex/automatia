const { Worker } = require('bullmq');
const { incomingQ, deadQ } = require('../lib/queue');
const { runFlow } = require('../lib/flow/engine');
const { PrismaClient } = require('@prisma/client');
const { open } = require('../lib/crypto');
const { getLLM } = require('../lib/llm');

const prisma = new PrismaClient();

// Función para obtener configuración del bot
async function getBotConfig(botId) {
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
    include: {
      defaultFlow: true,
      defaultProvider: true
    }
  });
  
  if (!bot) throw new Error(`Bot ${botId} no encontrado`);
  if (bot.status !== 'live') throw new Error(`Bot ${botId} no está activo`);
  
  return bot;
}

// Función para obtener configuración del canal
async function getChannelConfig(channelId) {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId }
  });
  
  if (!channel) throw new Error(`Canal ${channelId} no encontrado`);
  if (!channel.isActive) throw new Error(`Canal ${channelId} no está activo`);
  
  return channel;
}

// Función para obtener configuración del provider
async function getProviderConfig(providerId) {
  const provider = await prisma.provider.findUnique({
    where: { id: providerId }
  });
  
  if (!provider) throw new Error(`Provider ${providerId} no encontrado`);
  
  // Desencriptar API key
  const apiKey = open(provider.encKey);
  
  return {
    ...provider,
    apiKey
  };
}

// Función para guardar mensaje en la base de datos
async function saveMessage(data) {
  return await prisma.message.create({
    data: {
      botId: data.botId,
      channelId: data.channelId,
      externalUserId: data.externalUserId,
      role: data.role,
      content: data.content,
      meta: data.meta || {}
    }
  });
}

// Función para enviar respuesta por WhatsApp
async function sendWhatsAppResponse(phoneNumberId, accessToken, to, text) {
  const response = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: text }
      })
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`WhatsApp API error: ${error.error?.message || response.statusText}`);
  }
  
  return response.json();
}

// Función para enviar respuesta por Telegram
async function sendTelegramResponse(botToken, chatId, text) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Telegram API error: ${error.description || response.statusText}`);
  }
  
  return response.json();
}

// Función para enviar respuesta por Webchat
async function sendWebchatResponse(channelId, externalUserId, text) {
  // Por ahora solo guardamos en la base de datos
  await saveMessage({
    botId: '', // Se llenará después
    channelId,
    externalUserId,
    role: 'assistant',
    content: text
  });
}

// Procesador principal del job
async function processMessage(job) {
  const { data } = job;
  
  try {
    console.log(`[Worker] Procesando mensaje de ${data.channelType} para usuario ${data.externalUserId}`);
    
    // 1. Obtener configuraciones
    const bot = await getBotConfig(data.botId);
    const channel = await getChannelConfig(data.channelId);
    const provider = bot.defaultProviderId ? await getProviderConfig(bot.defaultProviderId) : null;
    
    // 2. Guardar mensaje del usuario
    const userMessage = await saveMessage({
      botId: data.botId,
      channelId: data.channelId,
      externalUserId: data.externalUserId,
      role: 'user',
      content: data.text
    });
    
    // 3. Ejecutar el flow engine
    let reply = 'Lo siento, no pude procesar tu mensaje.';
    
    if (bot.defaultFlow && provider) {
      const flow = bot.defaultFlow;
      if (flow.status === 'live') {
        const context = {
          history: [{ role: 'user', content: data.text }],
          providerCfg: {
            provider: provider.type,
            apiKey: provider.apiKey,
            baseUrl: provider.baseUrl,
            model: provider.model
          }
        };
        
        reply = await runFlow({ flow, context });
      }
    }
    
    // 4. Guardar respuesta del bot
    const botMessage = await saveMessage({
      botId: data.botId,
      channelId: data.channelId,
      externalUserId: data.externalUserId,
      role: 'assistant',
      content: reply
    });
    
    // 5. Enviar respuesta por el canal correspondiente
    switch (data.channelType) {
      case 'whatsapp':
        if (data.phoneNumberId && data.accessToken) {
          await sendWhatsAppResponse(
            data.phoneNumberId,
            data.accessToken,
            data.externalUserId,
            reply
          );
        }
        break;
        
      case 'telegram':
        if (data.botToken) {
          await sendTelegramResponse(
            data.botToken,
            data.externalUserId,
            reply
          );
        }
        break;
        
      case 'webchat':
        await sendWebchatResponse(
          data.channelId,
          data.externalUserId,
          reply
        );
        break;
    }
    
    console.log(`[Worker] Mensaje procesado exitosamente para ${data.externalUserId}`);
    
  } catch (error) {
    console.error(`[Worker] Error procesando mensaje:`, error);
    
    // Mover a cola de mensajes muertos
    await deadQ.add('dead', {
      data: job.data,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString()
    });
    
    throw error; // Re-lanzar para que BullMQ maneje el reintento
  }
}

// Configurar el worker
function startWorker() {
  const worker = new Worker('messages_incoming', processMessage, {
    connection: incomingQ.connection,
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '8'),
    removeOnComplete: 1000,
    removeOnFail: false,
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1500
    }
  });
  
  // Manejar eventos del worker
  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completado`);
  });
  
  worker.on('failed', async (job, err) => {
    console.error(`[Worker] Job ${job?.id} falló:`, err.message);
    
    // Si se agotaron los intentos, mover a DLQ
    if (job && job.attemptsMade >= (job.opts.attempts || 5)) {
      await deadQ.add('dead', {
        data: job.data,
        error: {
          name: err.name,
          message: err.message,
          stack: err.stack
        },
        timestamp: new Date().toISOString()
      });
    }
  });
  
  worker.on('error', (err) => {
    console.error('[Worker] Error del worker:', err);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('[Worker] Recibido SIGTERM, cerrando worker...');
    await worker.close();
    process.exit(0);
  });
  
  return worker;
}

// Iniciar el worker
startWorker();

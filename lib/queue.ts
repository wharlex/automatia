import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

// Configuración de Redis
const conn = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Cola principal para mensajes entrantes
export const incomingQ = new Queue('messages_incoming', { 
  connection: conn,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1500
    },
    removeOnComplete: 1000,
    removeOnFail: false
  }
});

// Cola de mensajes muertos (DLQ)
export const deadQ = new Queue('messages_dead', { 
  connection: conn,
  defaultJobOptions: {
    removeOnComplete: false,
    removeOnFail: false
  }
});

// Scheduler para manejar jobs retrasados (comentado por compatibilidad)
// export const scheduler = new QueueScheduler('messages_incoming', { 
//   connection: conn 
// });

// Función para iniciar el worker
export function startWorker(handler: (data: any) => Promise<void>) {
  return new Worker('messages_incoming', async job => {
    try {
      await handler(job.data);
    } catch (error) {
      console.error(`[Queue] Error procesando job ${job.id}:`, error);
      
      // Si se agotaron los intentos, mover a DLQ
      if (job.attemptsMade >= (job.opts.attempts || 5)) {
        await deadQ.add('dead', {
          data: job.data,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          },
          timestamp: new Date().toISOString()
        });
      }
      
      throw error; // Re-lanzar para que BullMQ maneje el reintento
    }
  }, { 
    connection: conn,
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '8'),
    removeOnComplete: 1000,
    removeOnFail: false
  });
}

// Función para limpiar colas
export async function cleanQueues() {
  await incomingQ.clean(0, 1000, 'completed');
  await incomingQ.clean(0, 1000, 'failed');
  await deadQ.clean(0, 1000, 'completed');
}

// Función para obtener estadísticas de las colas
export async function getQueueStats() {
  const [incomingStats, deadStats] = await Promise.all([
    incomingQ.getJobCounts(),
    deadQ.getJobCounts()
  ]);
  
  return {
    incoming: incomingStats,
    dead: deadStats,
    timestamp: new Date().toISOString()
  };
}

// Función para pausar todas las colas
export async function pauseQueues() {
  await incomingQ.pause();
  await deadQ.pause();
}

// Función para resumir todas las colas
export async function resumeQueues() {
  await incomingQ.resume();
  await deadQ.resume();
}

// Función para limpiar jobs muertos
export async function cleanDeadJobs() {
  const deadJobs = await deadQ.getJobs(['failed', 'delayed'], 0, 1000);
  
  for (const job of deadJobs) {
    if (job.finishedOn && Date.now() - job.finishedOn > 24 * 60 * 60 * 1000) { // 24 horas
      await job.remove();
    }
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Queue] Recibido SIGTERM, cerrando conexiones...');
  await conn.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[Queue] Recibido SIGINT, cerrando conexiones...');
  await conn.quit();
  process.exit(0);
});

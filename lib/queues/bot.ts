import { Queue, Worker, Job } from 'bullmq'
import { AIService } from '@/lib/services/AIService'
import { WhatsAppService } from '@/lib/services/WhatsAppService'
import { LogService } from '@/lib/services/LogService'
import { PDFService } from '@/lib/services/PDFService'
import { MemoryService } from '@/lib/services/MemoryService'

// Check if we're in build mode to avoid Redis connection issues
const isBuildMode = process.env.NODE_ENV === 'production' && process.env.BUILD_MODE === 'true'

// Initialize services
const aiService = new AIService()
const logService = new LogService()
const memoryService = new MemoryService()
const pdfService = new PDFService()

// Initialize WhatsApp service (will be configured per business)
let whatsappService: WhatsAppService | null = null

// Initialize queue and worker only if not in build mode
let botQueue: Queue | null = null
let botWorker: Worker | null = null

if (!isBuildMode) {
  // Initialize Redis connection
  const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3
  }

  // Initialize queue
  botQueue = new Queue('bot-queue', {
    connection: redisConfig,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: 100,
      removeOnFail: 50
    }
  })

  // Initialize worker
  botWorker = new Worker('bot-queue', async (job: Job) => {
    try {
      const { message, businessId } = job.data
      
      logService.info('Processing bot job', { 
        jobId: job.id, 
        messageId: message.id,
        businessId 
      })

      // Load business configuration
      const businessConfig = await loadBusinessConfig(businessId)
      if (!businessConfig) {
        throw new Error(`Business configuration not found for ${businessId}`)
      }

      // Initialize WhatsApp service with business config
      whatsappService = new WhatsAppService({
        phoneNumberId: businessConfig.whatsapp?.phoneNumberId,
        wabaId: businessConfig.whatsapp?.wabaId,
        accessToken: businessConfig.whatsapp?.accessToken,
        verifyToken: businessConfig.whatsapp?.verifyToken,
        appId: businessConfig.whatsapp?.appId,
        appSecret: businessConfig.whatsapp?.appSecret,
        mode: businessConfig.whatsapp?.mode || 'sandbox'
      })

      // Process message based on type
      let response: any
      
      switch (message.type) {
        case 'text':
          response = await processTextMessage(message, businessConfig)
          break
        case 'audio':
          response = await processAudioMessage(message, businessConfig)
          break
        case 'image':
          response = await processImageMessage(message, businessConfig)
          break
        case 'document':
          response = await processDocumentMessage(message, businessConfig)
          break
        default:
          response = await processTextMessage(message, businessConfig)
      }

      // Send response via WhatsApp
      if (response && whatsappService) {
        const sendResult = await whatsappService.sendText(
          message.from, 
          response.content,
          message.id
        )

        if (sendResult.success) {
          logService.info('Bot response sent successfully', {
            messageId: message.id,
            responseId: sendResult.messageId,
            businessId
          })
        } else {
          logService.error('Failed to send bot response', {
            messageId: message.id,
            error: sendResult.error,
            businessId
          })
        }
      }

      // Update conversation memory
      await memoryService.addToMemory(businessId, message.from, {
        user: message.content,
        bot: response?.content || 'No response generated',
        timestamp: new Date().toISOString()
      })

      return { success: true, response }

    } catch (error) {
      logService.error('Bot job processing failed', error, { 
        jobId: job.id,
        data: job.data 
      })
      throw error
    }
  }, {
    connection: redisConfig,
    concurrency: 5,
    removeOnComplete: 100,
    removeOnFail: 50
  })

  // Handle worker events
  botWorker.on('completed', (job: Job) => {
    logService.info('Bot job completed successfully', { 
      jobId: job.id,
      duration: Date.now() - job.timestamp
    })
  })

  botWorker.on('failed', (job: Job, err: Error) => {
    logService.error('Bot job failed', err, { 
      jobId: job.id,
      attempts: job.attemptsMade
    })
  })

  botWorker.on('error', (err: Error) => {
    logService.error('Bot worker error', err)
  })
}

// Load business configuration from file
async function loadBusinessConfig(businessId: string) {
  try {
    const fs = await import('fs')
    const path = await import('path')
    
    const businessFile = path.join(process.cwd(), 'data', 'business-config.json')
    const aiFile = path.join(process.cwd(), 'data', 'ai-config.json')
    const whatsappFile = path.join(process.cwd(), 'data', 'whatsapp-config.json')
    
    let businessConfig: any = {}
    
    // Load business info
    if (fs.existsSync(businessFile)) {
      const businessData = fs.readFileSync(businessFile, 'utf8')
      businessConfig.business = JSON.parse(businessData)
    }
    
    // Load AI config
    if (fs.existsSync(aiFile)) {
      const aiData = fs.readFileSync(aiFile, 'utf8')
      businessConfig.ai = JSON.parse(aiData)
    }
    
    // Load WhatsApp config
    if (fs.existsSync(whatsappFile)) {
      const whatsappData = fs.readFileSync(whatsappFile, 'utf8')
      businessConfig.whatsapp = JSON.parse(whatsappData)
    }
    
    return businessConfig
  } catch (error) {
    logService.error('Error loading business config', error, { businessId })
    return null
  }
}

// Process text messages
async function processTextMessage(message: any, businessConfig: any) {
  try {
    const startTime = Date.now()
    
    // Search knowledge base for relevant context
    const knowledgeContext = await aiService.searchKnowledge(message.content)
    
    // Get conversation memory
    const memory = await memoryService.getMemory(businessConfig.business?.id || 'default', message.from)
    
    // Prepare system message with business context and knowledge
    const systemMessage = aiService.composePrompt(businessConfig.business, message.content)
    
    // Prepare conversation messages
    const messages = [
      { role: 'system', content: systemMessage },
      ...memoryService.formatMessagesForAI(memory, 10), // Last 10 messages
      { role: 'user', content: message.content }
    ]
    
    // Generate AI response
    const response = await aiService.chat(messages, knowledgeContext)
    
    const processingTime = Date.now() - startTime
    
    logService.info('Text message processed', {
      messageId: message.id,
      processingTime,
      knowledgeUsed: knowledgeContext.relevantDocs.length > 0,
      memoryUsed: memory.length > 0
    })
    
    return {
      content: response,
      type: 'text',
      processingTime,
      knowledgeContext: knowledgeContext.relevantDocs.length > 0 ? knowledgeContext : null
    }
    
  } catch (error) {
    logService.error('Error processing text message', error, { messageId: message.id })
    return {
      content: 'Lo siento, estoy teniendo problemas para procesar tu mensaje. Por favor, inténtalo de nuevo.',
      type: 'text',
      error: true
    }
  }
}

// Process audio messages
async function processAudioMessage(message: any, businessConfig: any) {
  try {
    const startTime = Date.now()
    
    // Download audio from WhatsApp
    if (!whatsappService) {
      throw new Error('WhatsApp service not initialized')
    }
    
    const audioBuffer = await whatsappService.downloadMedia(message.metadata.audioId)
    if (!audioBuffer) {
      throw new Error('Failed to download audio')
    }
    
    // Transcribe audio to text
    const transcription = await aiService.transcribeAudio(audioBuffer)
    
    // Process transcription as text message
    const textMessage = { ...message, content: transcription, type: 'text' }
    const response = await processTextMessage(textMessage, businessConfig)
    
    const processingTime = Date.now() - startTime
    
    logService.info('Audio message processed', {
      messageId: message.id,
      transcription,
      processingTime
    })
    
    return {
      ...response,
      originalAudio: true,
      transcription
    }
    
  } catch (error) {
    logService.error('Error processing audio message', error, { messageId: message.id })
    return {
      content: 'Lo siento, no pude procesar tu mensaje de audio. Por favor, envía un mensaje de texto.',
      type: 'text',
      error: true
    }
  }
}

// Process image messages
async function processImageMessage(message: any, businessConfig: any) {
  try {
    const startTime = Date.now()
    
    // Get image URL from WhatsApp
    if (!whatsappService) {
      throw new Error('WhatsApp service not initialized')
    }
    
    const imageUrl = await whatsappService.getMediaUrl(message.metadata.imageId)
    if (!imageUrl) {
      throw new Error('Failed to get image URL')
    }
    
    // Analyze image with AI vision
    const imageDescription = await aiService.visionDescribe(
      imageUrl, 
      'Describe esta imagen en detalle para un negocio'
    )
    
    // Process image description as text message
    const textMessage = { 
      ...message, 
      content: `[Imagen]: ${imageDescription}`, 
      type: 'text' 
    }
    const response = await processTextMessage(textMessage, businessConfig)
    
    const processingTime = Date.now() - startTime
    
    logService.info('Image message processed', {
      messageId: message.id,
      imageDescription,
      processingTime
    })
    
    return {
      ...response,
      originalImage: true,
      imageDescription
    }
    
  } catch (error) {
    logService.error('Error processing image message', error, { messageId: message.id })
    return {
      content: 'Lo siento, no pude procesar tu imagen. Por favor, envía un mensaje de texto.',
      type: 'text',
      error: true
    }
  }
}

// Process document messages
async function processDocumentMessage(message: any, businessConfig: any) {
  try {
    const startTime = Date.now()
    
    // Download document from WhatsApp
    if (!whatsappService) {
      throw new Error('WhatsApp service not initialized')
    }
    
    const documentBuffer = await whatsappService.downloadMedia(message.metadata.documentId)
    if (!documentBuffer) {
      throw new Error('Failed to download document')
    }
    
    // Extract text from document
    let extractedText = ''
    if (message.metadata.mimeType === 'application/pdf') {
      const result = await pdfService.extractTextWithMetadata(documentBuffer)
      extractedText = result.text
    } else if (message.metadata.mimeType === 'text/plain') {
      extractedText = documentBuffer.toString('utf-8')
    } else {
      extractedText = `[Documento: ${message.metadata.filename}]`
    }
    
    // Process extracted text as text message
    const textMessage = { 
      ...message, 
      content: `[Documento]: ${extractedText}`, 
      type: 'text' 
    }
    const response = await processTextMessage(textMessage, businessConfig)
    
    const processingTime = Date.now() - startTime
    
    logService.info('Document message processed', {
      messageId: message.id,
      filename: message.metadata.filename,
      extractedLength: extractedText.length,
      processingTime
    })
    
    return {
      ...response,
      originalDocument: true,
      documentInfo: {
        filename: message.metadata.filename,
        extractedText: extractedText.substring(0, 200) + '...'
      }
    }
    
  } catch (error) {
    logService.error('Error processing document message', error, { messageId: message.id })
    return {
      content: 'Lo siento, no pude procesar tu documento. Por favor, envía un mensaje de texto.',
      type: 'text',
      error: true
    }
  }
}

// Add message to queue
export async function addMessageToQueue(message: any, businessId: string) {
  if (!botQueue) {
    logService.warn('Bot queue not initialized, processing message directly')
    // Fallback: process message directly
    const businessConfig = await loadBusinessConfig(businessId)
    if (businessConfig) {
      return await processTextMessage(message, businessConfig)
    }
    return null
  }
  
  try {
    const job = await botQueue.add('process-message', { message, businessId }, {
      priority: 1,
      delay: 0
    })
    
    logService.info('Message added to queue', {
      jobId: job.id,
      messageId: message.id,
      businessId
    })
    
    return { jobId: job.id, queued: true }
    
  } catch (error) {
    logService.error('Error adding message to queue', error, { messageId: message.id, businessId })
    throw error
  }
}

// Get queue status
export async function getQueueStatus() {
  if (!botQueue) return null
  
  try {
    const waiting = await botQueue.getWaiting()
    const active = await botQueue.getActive()
    const completed = await botQueue.getCompleted()
    const failed = await botQueue.getFailed()
    
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      total: waiting.length + active.length + completed.length + failed.length
    }
  } catch (error) {
    logService.error('Error getting queue status', error)
    return null
  }
}

// Clean up queue
export async function cleanupQueue() {
  if (botQueue) {
    await botQueue.close()
  }
  if (botWorker) {
    await botWorker.close()
  }
}

// Export for testing
export { botQueue, botWorker }


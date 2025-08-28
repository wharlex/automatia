import { NextRequest, NextResponse } from 'next/server'
import { addMessageToQueue } from '@/lib/queues/bot'
import { verifyMetaSignature } from '@/lib/crypto'
import { LogService } from '@/lib/services/LogService'

const logService = new LogService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')
    
    // Get verify token from config
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'automatia_verify_token'
    
    if (mode === 'subscribe' && token === verifyToken) {
      logService.info('WhatsApp webhook verified successfully')
      return new Response(challenge, { status: 200 })
    }
    
    logService.warn('WhatsApp webhook verification failed', { mode, token })
    return new Response('Forbidden', { status: 403 })
    
  } catch (error) {
    logService.error('WhatsApp webhook verification error', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify signature for security
    const signature = request.headers.get('x-hub-signature-256')
    if (!signature) {
      logService.warn('Missing WhatsApp signature header')
      return new Response('Unauthorized', { status: 401 })
    }
    
    const body = await request.text()
    const isValid = verifyMetaSignature(process.env.WHATSAPP_APP_SECRET || '', Buffer.from(body), signature)
    
    if (!isValid) {
      logService.warn('Invalid WhatsApp signature')
      return new Response('Unauthorized', { status: 401 })
    }
    
    const payload = JSON.parse(body)
    logService.info('WhatsApp webhook received', { 
      object: payload.object,
      entryCount: payload.entry?.length || 0 
    })
    
    // Process WhatsApp messages
    if (payload.object === 'whatsapp_business_account') {
      for (const entry of payload.entry || []) {
        for (const change of entry.changes || []) {
          if (change.value?.messages) {
            for (const message of change.value.messages) {
              await processWhatsAppMessage(message, change.value.metadata)
            }
          }
          
          // Handle status updates
          if (change.value?.statuses) {
            for (const status of change.value.statuses) {
              await processStatusUpdate(status, change.value.metadata)
            }
          }
        }
      }
    }
    
    return new Response('OK', { status: 200 })
    
  } catch (error) {
    logService.error('WhatsApp webhook processing error', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

async function processWhatsAppMessage(message: any, metadata: any) {
  try {
    const messageData = {
      id: message.id,
      type: message.type,
      content: extractMessageContent(message),
      from: message.from,
      timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
      metadata: {
        businessAccountId: metadata.business_account_id,
        phoneNumberId: metadata.phone_number_id,
        messageType: message.type,
        // Additional metadata based on message type
        ...(message.type === 'text' && { text: message.text?.body }),
        ...(message.type === 'audio' && { 
          audioId: message.audio?.id,
          mimeType: message.audio?.mime_type,
          sha256: message.audio?.sha256
        }),
        ...(message.type === 'image' && { 
          imageId: message.image?.id,
          mimeType: message.image?.mime_type,
          sha256: message.image?.sha256
        }),
        ...(message.type === 'document' && { 
          documentId: message.document?.id,
          filename: message.document?.filename,
          mimeType: message.document?.mime_type,
          sha256: message.document?.sha256
        })
      }
    }
    
    logService.info('Processing WhatsApp message', { 
      messageId: messageData.id,
      type: messageData.type,
      from: messageData.from
    })
    
    // Add message to processing queue
    await addMessageToQueue(messageData, metadata.business_account_id)
    
    // Log successful processing
    logService.info('WhatsApp message queued successfully', { 
      messageId: messageData.id,
      queueStatus: 'added'
    })
    
  } catch (error) {
    logService.error('Error processing WhatsApp message', error, { 
      messageId: message.id,
      from: message.from
    })
  }
}

async function processStatusUpdate(status: any, metadata: any) {
  try {
    logService.info('WhatsApp status update', {
      messageId: status.id,
      status: status.status,
      timestamp: new Date(parseInt(status.timestamp) * 1000).toISOString(),
      businessAccountId: metadata.business_account_id
    })
    
    // Here you could update conversation status, track delivery, etc.
    // For now, just log the status update
    
  } catch (error) {
    logService.error('Error processing status update', error, { 
      messageId: status.id 
    })
  }
}

function extractMessageContent(message: any): string {
  switch (message.type) {
    case 'text':
      return message.text?.body || ''
    case 'audio':
      return '[Audio Message]'
    case 'image':
      return '[Image Message]'
    case 'document':
      return `[Document: ${message.document?.filename || 'Unknown'}]`
    case 'video':
      return '[Video Message]'
    case 'location':
      return `[Location: ${message.location?.latitude}, ${message.location?.longitude}]`
    case 'contact':
      return `[Contact: ${message.contacts?.[0]?.name?.formatted_name || 'Unknown'}]`
    case 'sticker':
      return '[Sticker]'
    default:
      return `[${message.type} Message]`
  }
}





import { NextRequest, NextResponse } from 'next/server'

// WhatsApp send message API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, type, content, workspaceId } = body

    // Validate required fields
    if (!to || !type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: to, type, content' },
        { status: 400 }
      )
    }

    // Validate phone number format (remove + and add country code if needed)
    const phoneNumber = formatPhoneNumber(to)
    
    // Prepare message payload based on type
    const messagePayload = prepareMessagePayload(type, content)
    
    // Send message via WhatsApp Cloud API
    const response = await sendWhatsAppMessage(phoneNumber, messagePayload)
    
    if (response.success) {
      console.log(`✅ Message sent successfully to ${phoneNumber}:`, response.messageId)
      
      // TODO: Save message to database
      // await saveOutgoingMessage(workspaceId, phoneNumber, type, content, response.messageId)
      
      return NextResponse.json({
        success: true,
        messageId: response.messageId,
        status: 'sent'
      })
    } else {
      console.error(`❌ Failed to send message to ${phoneNumber}:`, response.error)
      return NextResponse.json(
        { error: response.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('❌ Error in WhatsApp send API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Format phone number for WhatsApp API
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '')
  
  // Add country code if not present (assuming Argentina +54)
  if (cleaned.length === 10) {
    cleaned = '54' + cleaned
  }
  
  return cleaned
}

// Prepare message payload based on type
function prepareMessagePayload(type: string, content: any) {
  switch (type) {
    case 'text':
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        type: 'text',
        text: { body: content }
      }
    
    case 'image':
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        type: 'image',
        image: {
          link: content.url,
          caption: content.caption || ''
        }
      }
    
    case 'document':
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        type: 'document',
        document: {
          link: content.url,
          caption: content.caption || '',
          filename: content.filename || 'document'
        }
      }
    
    case 'template':
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        type: 'template',
        template: {
          name: content.name,
          language: {
            code: content.language || 'es'
          },
          components: content.components || []
        }
      }
    
    case 'interactive':
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        type: 'interactive',
        interactive: content
      }
    
    default:
      throw new Error(`Unsupported message type: ${type}`)
  }
}

// Send message via WhatsApp Cloud API
async function sendWhatsAppMessage(to: string, payload: any) {
  const phoneNumberId = process.env.META_WABA_PHONE_ID
  const accessToken = process.env.META_WABA_TOKEN
  
  if (!phoneNumberId || !accessToken) {
    return {
      success: false,
      error: 'WhatsApp configuration missing'
    }
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...payload,
          to: to
        })
      }
    )

    const data = await response.json()

    if (response.ok && data.messages && data.messages[0]) {
      return {
        success: true,
        messageId: data.messages[0].id
      }
    } else {
      console.error('WhatsApp API error:', data)
      return {
        success: false,
        error: data.error?.message || 'Unknown error from WhatsApp API'
      }
    }
  } catch (error) {
    console.error('Network error sending WhatsApp message:', error)
    return {
      success: false,
      error: 'Network error'
    }
  }
}

// TODO: Implement database functions
// async function saveOutgoingMessage(workspaceId: string, to: string, type: string, content: any, messageId: string) {
//   // Save outgoing message to database using Prisma
// }










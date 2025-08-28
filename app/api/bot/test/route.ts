import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AIService } from '@/lib/services/AIService'
import { WhatsAppService } from '@/lib/services/WhatsAppService'
import { LogService } from '@/lib/services/LogService'

// Validation schema for test request
const TestRequestSchema = z.object({
  businessId: z.string().min(1),
  phoneNumber: z.string().min(1),
  message: z.string().min(1).max(500),
  type: z.enum(['text', 'audio']).default('text')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = TestRequestSchema.parse(body)
    
    const logService = new LogService()
    await logService.info(validatedData.businessId, 'Test message initiated', {
      phoneNumber: validatedData.phoneNumber,
      message: validatedData.message,
      type: validatedData.type
    })

    // Get business configuration (in real app, fetch from DB)
    const config = await getBusinessConfig(validatedData.businessId)
    if (!config) {
      await logService.error(validatedData.businessId, 'No configuration found for test')
      return NextResponse.json({
        success: false,
        message: 'No configuration found for business'
      }, { status: 404 })
    }

    // Initialize services
    const whatsappService = new WhatsAppService(config.whatsapp)
    const aiService = new AIService(config.ai?.openaiKeyEnc)

    // Generate AI response
    const aiResponse = await aiService.chat({
      businessId: validatedData.businessId,
      text: validatedData.message,
      memory: []
    })

    await logService.info(validatedData.businessId, 'AI response generated', {
      response: aiResponse
    })

    // Send response based on type
    if (validatedData.type === 'audio') {
      // Generate audio response
      const audioBuffer = await aiService.tts({ text: aiResponse })
      await whatsappService.sendAudio(validatedData.phoneNumber, audioBuffer)
      
      await logService.info(validatedData.businessId, 'Audio test message sent', {
        phoneNumber: validatedData.phoneNumber
      })
    } else {
      // Send text response
      await whatsappService.sendText(validatedData.phoneNumber, aiResponse)
      
      await logService.info(validatedData.businessId, 'Text test message sent', {
        phoneNumber: validatedData.phoneNumber
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Test message sent successfully',
      response: aiResponse,
      type: validatedData.type
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 })
    }

    console.error('Error sending test message:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}

// Get business configuration (placeholder - in real app, fetch from DB)
async function getBusinessConfig(businessId: string) {
  // This would fetch from database in real implementation
  // For now, return mock config
  return {
    whatsapp: {
      phoneNumberId: 'mock-phone-number-id',
      wabaId: 'mock-waba-id',
      accessTokenEnc: 'mock-encrypted-token',
      verifyTokenEnc: 'mock-verify-token',
      graphVersion: 'v21.0',
      mode: 'sandbox'
    },
    ai: {
      openaiKeyEnc: process.env.OPENAI_API_KEY
    }
  }
}






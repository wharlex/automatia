import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({
        success: false,
        message: 'Business ID is required'
      }, { status: 400 })
    }

    // In a real implementation, fetch from database and check actual status
    // For now, return mock status
    const mockStatus = {
      businessId,
      whatsapp: {
        status: 'configured',
        phoneNumberId: 'mock-phone-number-id',
        wabaId: 'mock-waba-id',
        mode: 'sandbox',
        lastVerification: new Date().toISOString(),
        webhookUrl: `${process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001'}/api/webhooks/whatsapp`
      },
      ai: {
        status: 'configured',
        model: 'gpt-4o-mini',
        hasOpenAIKey: true,
        lastTest: new Date().toISOString()
      },
      bot: {
        status: 'active',
        lastMessage: new Date().toISOString(),
        totalMessages: 0,
        activeConversations: 0
      },
      system: {
        uptime: '1h 23m',
        version: '1.0.0',
        lastHealthCheck: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      status: mockStatus
    })

  } catch (error) {
    console.error('Error fetching bot status:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}






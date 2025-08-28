import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/lib/services/AIService'
import { addMessageToQueue } from '@/lib/queues/bot'

export async function POST(request: NextRequest) {
  try {
    const { testType, message, businessId = 'test-business' } = await request.json()
    
    if (!testType || !message) {
      return NextResponse.json(
        { error: 'Test type and message are required' },
        { status: 400 }
      )
    }

    let result: any = {}
    
    switch (testType) {
      case 'ai-response':
        result = await testAIResponse(message)
        break
        
      case 'knowledge-search':
        result = await testKnowledgeSearch(message)
        break
        
      case 'bot-queue':
        result = await testBotQueue(message, businessId)
        break
        
      case 'complete-flow':
        result = await testCompleteFlow(message, businessId)
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid test type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      testType,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    )
  }
}

// Test AI response generation
async function testAIResponse(message: string) {
  try {
    const aiService = new AIService(process.env.OPENAI_API_KEY)
    
    // Mock business config
    const businessConfig = {
      name: 'Restaurante Test',
      industry: 'Gastronomía',
      description: 'Restaurante de comida italiana',
      hours: 'Lunes a Domingo 12:00-23:00',
      phone: '+5493411234567'
    }
    
    const systemPrompt = aiService.composePrompt(businessConfig, message)
    
    const response = await aiService.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ])
    
    return {
      input: message,
      output: response,
      businessContext: businessConfig,
      processingTime: Date.now() // Mock timing
    }
  } catch (error) {
    throw new Error(`AI test failed: ${error.message}`)
  }
}

// Test knowledge base search
async function testKnowledgeSearch(query: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/knowledge/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit: 5 })
    })
    
    if (!response.ok) {
      throw new Error('Knowledge search failed')
    }
    
    const data = await response.json()
    
    return {
      query,
      results: data.results,
      totalResults: data.totalResults
    }
  } catch (error) {
    throw new Error(`Knowledge search test failed: ${error.message}`)
  }
}

// Test bot queue processing
async function testBotQueue(message: string, businessId: string) {
  try {
    const testMessage = {
      id: `test_${Date.now()}`,
      type: 'text',
      content: message,
      from: '+5493411234567',
      timestamp: new Date().toISOString()
    }
    
    await addMessageToQueue(testMessage, businessId)
    
    return {
      message: testMessage,
      queueStatus: 'Message added to queue',
      businessId
    }
  } catch (error) {
    throw new Error(`Queue test failed: ${error.message}`)
  }
}

// Test complete chatbot flow
async function testCompleteFlow(message: string, businessId: string) {
  try {
    const results = {
      step1: 'AI Response Generation',
      step2: 'Knowledge Base Integration',
      step3: 'Queue Processing',
      step4: 'Response Delivery'
    }
    
    // Step 1: AI Response
    const aiResult = await testAIResponse(message)
    
    // Step 2: Knowledge Search
    const knowledgeResult = await testKnowledgeSearch(message)
    
    // Step 3: Queue Processing
    const queueResult = await testBotQueue(message, businessId)
    
    // Step 4: Simulate response delivery
    const deliveryResult = {
      status: 'delivered',
      method: 'WhatsApp',
      recipient: '+5493411234567',
      timestamp: new Date().toISOString()
    }
    
    return {
      flow: results,
      aiResponse: aiResult,
      knowledgeSearch: knowledgeResult,
      queueProcessing: queueResult,
      delivery: deliveryResult,
      totalProcessingTime: Date.now() // Mock timing
    }
  } catch (error) {
    throw new Error(`Complete flow test failed: ${error.message}`)
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Chatbot Test API is running',
    availableTests: [
      'ai-response',
      'knowledge-search', 
      'bot-queue',
      'complete-flow'
    ],
    usage: 'POST with testType and message to run tests'
  })
}




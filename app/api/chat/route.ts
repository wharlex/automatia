import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { message, contactId, channel, context } = await req.json()

    if (!message || !contactId || !channel) {
      return NextResponse.json({ 
        error: "Mensaje, contactId y channel son requeridos" 
      }, { status: 400 })
    }

    // Obtener configuración de IA
    const aiConfigDoc = await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('ai')
      .doc('config')
      .get()

    if (!aiConfigDoc.exists || !aiConfigDoc.data()?.isActive) {
      return NextResponse.json({ 
        error: "IA no configurada o inactiva" 
      }, { status: 400 })
    }

    const aiConfig = aiConfigDoc.data()

    // Obtener base de conocimiento relevante
    const knowledgeSnapshot = await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('knowledge')
      .where('isActive', '==', true)
      .get()

    const knowledgeDocs = knowledgeSnapshot.docs.map(doc => doc.data())
    
    // Construir contexto con base de conocimiento
    let systemPrompt = aiConfig.instructions
    if (knowledgeDocs.length > 0) {
      const relevantDocs = knowledgeDocs
        .filter(doc => 
          doc.content.toLowerCase().includes(message.toLowerCase()) ||
          doc.tags.some(tag => message.toLowerCase().includes(tag.toLowerCase()))
        )
        .slice(0, 3) // Máximo 3 documentos relevantes

      if (relevantDocs.length > 0) {
        systemPrompt += "\n\nInformación relevante del negocio:\n"
        relevantDocs.forEach(doc => {
          systemPrompt += `- ${doc.title}: ${doc.content}\n`
        })
      }
    }

    // Generar respuesta con IA
    let aiResponse
    try {
      if (aiConfig.provider === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.model}:generateContent?key=${aiConfig.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: systemPrompt }]
            }, {
              parts: [{ text: `Usuario: ${message}\n\nResponde como ${aiConfig.personality?.name || 'Automatía'}:` }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000
            }
          })
        })

        if (!response.ok) {
          throw new Error('Error en API de Gemini')
        }

        const data = await response.json()
        aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no pude generar una respuesta.'
      } else if (aiConfig.provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${aiConfig.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: aiConfig.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            max_tokens: 1000,
            temperature: 0.7
          })
        })

        if (!response.ok) {
          throw new Error('Error en API de OpenAI')
        }

        const data = await response.json()
        aiResponse = data.choices?.[0]?.message?.content || 'Lo siento, no pude generar una respuesta.'
      }
    } catch (error) {
      console.error('Error generando respuesta de IA:', error)
      aiResponse = 'Lo siento, estoy teniendo problemas técnicos. Por favor, intenta más tarde.'
    }

    // Guardar conversación en Firestore
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const conversation = {
      id: conversationId,
      contactId,
      channel,
      messages: [
        {
          id: `msg_${Date.now()}_1`,
          role: 'user',
          content: message,
          timestamp: new Date(),
          metadata: { context }
        },
        {
          id: `msg_${Date.now()}_2`,
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
          metadata: { 
            aiProvider: aiConfig.provider,
            model: aiConfig.model,
            knowledgeUsed: knowledgeDocs.length > 0
          }
        }
      ],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.uid,
      workspaceId: user.workspaceId || 'default',
      aiConfig: {
        provider: aiConfig.provider,
        model: aiConfig.model
      }
    }

    await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('conversations')
      .doc(conversationId)
      .set(conversation)

    // Actualizar estadísticas de uso de documentos de conocimiento
    if (knowledgeDocs.length > 0) {
      const batch = adminDb.batch()
      knowledgeDocs.forEach(doc => {
        const docRef = adminDb
          .collection('workspaces')
          .doc(user.workspaceId || 'default')
          .collection('knowledge')
          .doc(doc.id)
        
        batch.update(docRef, {
          'usage.totalQueries': adminDb.FieldValue.increment(1),
          'usage.lastUsed': new Date()
        })
      })
      await batch.commit()
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      conversationId,
      knowledgeUsed: knowledgeDocs.length > 0
    })

  } catch (error) {
    console.error("[Chat] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { searchParams } = new URL(req.url)
    const contactId = searchParams.get('contactId')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('conversations')
      .orderBy('updatedAt', 'desc')
      .limit(limit)

    if (contactId) {
      query = query.where('contactId', '==', contactId)
    }

    const snapshot = await query.get()
    const conversations = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        contactId: data.contactId,
        channel: data.channel,
        messageCount: data.messages?.length || 0,
        lastMessage: data.messages?.[data.messages.length - 1]?.content,
        status: data.status,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString()
      }
    })

    return NextResponse.json({ conversations })

  } catch (error) {
    console.error("[Chat Get] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
      'Access-Control-Max-Age': '86400',
    },
  })
}

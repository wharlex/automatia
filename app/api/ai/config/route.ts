import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { provider, apiKey, model, instructions, personality } = await req.json()

    if (!provider || !apiKey || !model || !instructions) {
      return NextResponse.json({ 
        error: "Provider, API Key, Model e Instructions son requeridos" 
      }, { status: 400 })
    }

    // Probar la API Key
    let testResult
    try {
      if (provider === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: "Hola, responde solo 'OK' si funcionas correctamente." }]
            }]
          })
        })
        
        if (!response.ok) {
          throw new Error('API Key de Gemini inválida')
        }
        
        const data = await response.json()
        testResult = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Error en respuesta'
      } else if (provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: 'Hola, responde solo OK si funcionas correctamente.' }],
            max_tokens: 10
          })
        })
        
        if (!response.ok) {
          throw new Error('API Key de OpenAI inválida')
        }
        
        const data = await response.json()
        testResult = data.choices?.[0]?.message?.content || 'Error en respuesta'
      }
    } catch (error) {
      return NextResponse.json({ 
        error: `Error al probar API Key: ${error.message}` 
      }, { status: 400 })
    }

    // Guardar configuración en Firestore
    const aiConfig = {
      provider,
      apiKey: apiKey.substring(0, 8) + '...', // Solo guardar parte de la key por seguridad
      model,
      instructions,
      personality: personality || {
        name: "Automatía",
        tone: "professional",
        language: "es",
        greeting: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?",
        farewell: "¡Gracias por contactarnos! Que tengas un excelente día."
      },
      isActive: true,
      configuredAt: new Date(),
      lastTested: new Date(),
      testResult,
      userId: user.uid,
      workspaceId: user.workspaceId || 'default'
    }

    await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('ai')
      .doc('config')
      .set(aiConfig)

    return NextResponse.json({
      success: true,
      message: "Configuración de IA guardada exitosamente",
      config: {
        provider,
        model,
        instructions,
        personality: aiConfig.personality,
        isActive: true,
        testResult
      }
    })

  } catch (error) {
    console.error("[AI Config] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    
    const configDoc = await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('ai')
      .doc('config')
      .get()

    if (!configDoc.exists) {
      return NextResponse.json({ 
        isConfigured: false,
        config: null 
      })
    }

    const config = configDoc.data()
    return NextResponse.json({
      isConfigured: true,
      config: {
        provider: config?.provider,
        model: config?.model,
        instructions: config?.instructions,
        personality: config?.personality,
        isActive: config?.isActive,
        configuredAt: config?.configuredAt?.toDate?.()?.toISOString(),
        lastTested: config?.lastTested?.toDate?.()?.toISOString()
      }
    })

  } catch (error) {
    console.error("[AI Config Get] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { isActive } = await req.json()

    await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('ai')
      .doc('config')
      .update({
        isActive: isActive,
        updatedAt: new Date()
      })

    return NextResponse.json({
      success: true,
      message: `IA ${isActive ? 'activada' : 'desactivada'} exitosamente`
    })

  } catch (error) {
    console.error("[AI Config Update] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

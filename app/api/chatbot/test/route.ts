import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { runFlow } from "@/lib/flow/engine"

const TestRequestSchema = z.object({
  message: z.string().min(1, "El mensaje es requerido")
})

export async function POST(req: NextRequest) {
  try {
    // TODO: Implementar autenticación real
    const body = await req.json()
    
    // Validar request
    const validatedRequest = TestRequestSchema.parse(body)
    
    // TODO: obtener bot activo y flujo desde base de datos
    const bot = await getActiveBot()
    const flow = await getFlowForBot(bot.id)
    const providerCfg = await getProviderConfigForBot(bot.id)
    
    // Ejecutar Flow Engine real
    const reply = await runFlow({ 
      flow, 
      context: { 
        history: [{ role: 'user', content: validatedRequest.message }], 
        providerCfg 
      } 
    })
    
    return NextResponse.json({ reply })
    
  } catch (error) {
    console.error("[ChatBot Test] error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos de prueba inválidos", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Error al ejecutar prueba" },
      { status: 500 }
    )
  }
}

// TODO: implementar estas funciones desde base de datos
async function getActiveBot() {
  return { id: 'default_bot' }
}

async function getFlowForBot(botId: string) {
  return {
    entryNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        type: 'llm',
        prompt: 'Eres un asistente amigable y útil. Responde de manera clara y concisa.',
        next: 'end'
      },
      end: {
        id: 'end',
        type: 'end',
        text: 'Respuesta generada'
      }
    }
  }
}

async function getProviderConfigForBot(botId: string) {
  return {
    provider: 'openai' as const,
    apiKey: process.env.OPENAI_API_KEY || '',
    baseUrl: process.env.OPENAI_BASE_URL,
    model: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini'
  }
}

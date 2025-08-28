import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { z } from "zod"
import { seal, open } from "@/lib/crypto"
import type { ChatbotConfig } from "@/types/chatbot"

// Schema de validación para la configuración completa del ChatBot
const ChatBotConfigSchema = z.object({
  bot: z.object({
    name: z.string().min(1, "El nombre del bot es requerido"),
    language: z.enum(["es", "en"]),
    persona: z.enum(["Profesional", "Amigable", "Directo"])
  }),
  llm: z.object({
    provider: z.enum(["openai", "gemini", "anthropic"]),
    apiKey: z.string().optional(),
    baseUrl: z.string().optional(),
    model: z.string().min(1, "El modelo es requerido")
  }),
  channels: z.object({
    whatsapp: z.object({
      active: z.boolean(),
      phoneNumberId: z.string(),
      verifyToken: z.string(),
      appSecret: z.string(),
      accessToken: z.string()
    }).optional(),
    telegram: z.object({
      active: z.boolean(),
      botToken: z.string()
    }).optional(),
    webchat: z.object({
      active: z.boolean(),
      publicSlug: z.string()
    }).optional()
  }),
  flow: z.object({
    defaultFlowId: z.string().optional()
  }),
  status: z.enum(["draft", "live"]).default("draft")
})

export async function GET(req: NextRequest) {
  try {
    // TODO: Implementar autenticación real
    // Por ahora retornamos configuración de ejemplo para desarrollo
    
    const config: ChatbotConfig = {
      bot: {
        name: "Mi ChatBot",
        language: "es",
        persona: "Profesional"
      },
      llm: {
        provider: "openai",
        apiKey: "",
        baseUrl: "",
        model: "gpt-4o-mini"
      },
      channels: {
        whatsapp: {
          active: false,
          phoneNumberId: "",
          verifyToken: "",
          appSecret: "",
          accessToken: ""
        },
        telegram: {
          active: false,
          botToken: ""
        },
        webchat: {
          active: true,
          publicSlug: "mi-chatbot"
        }
      },
      flow: {
        defaultFlowId: "default"
      },
      status: "draft"
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error("[ChatBot Config GET] error:", error)
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const body = await req.json()
    
    // Validar con Zod
    const validatedConfig = ChatBotConfigSchema.parse(body)
    
    // Encriptar API keys si se proporcionan
    if (validatedConfig.llm.apiKey) {
      validatedConfig.llm.apiKey = seal(validatedConfig.llm.apiKey)
    }
    
    // Encriptar configuraciones sensibles de canales
    if (validatedConfig.channels.whatsapp) {
      const whatsapp = validatedConfig.channels.whatsapp
      whatsapp.appSecret = seal(whatsapp.appSecret)
      whatsapp.accessToken = seal(whatsapp.accessToken)
    }
    
    if (validatedConfig.channels.telegram?.botToken) {
      validatedConfig.channels.telegram.botToken = seal(validatedConfig.channels.telegram.botToken)
    }
    
    // TODO: Implementar guardado en base de datos
    // Por ahora solo validamos y retornamos éxito
    
    const updatedConfig = {
      ...validatedConfig,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      message: "Configuración guardada exitosamente",
      config: updatedConfig
    })
  } catch (error) {
    console.error("[ChatBot Config PUT] error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos de configuración inválidos", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Error al guardar configuración" },
      { status: 500 }
    )
  }
}

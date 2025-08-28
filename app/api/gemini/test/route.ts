import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { testLLMConnection } from "@/lib/llm"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { provider, apiKey, model } = await req.json()

    if (!provider || !apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Provider y API key son requeridos",
        },
        { status: 400 },
      )
    }

    const result = await testLLMConnection(provider, apiKey, model)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Conexión exitosa con ${provider}`,
        availableModels: result.availableModels,
        details: {
          provider,
          model: model || (provider === "openai" ? "gpt-4o-mini" : "gemini-1.5-flash"),
          modelsCount: result.availableModels?.length || 0,
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || "Error de conexión desconocido",
      })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

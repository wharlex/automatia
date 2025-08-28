import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { generateSystemPrompt } from "@/lib/bot-router"
import { streamLLM, type ChatMessage } from "@/lib/llm"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)

    const systemPrompt = await generateSystemPrompt(user.uid)

    const testMessages: ChatMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: "Hola, presentate y contame cómo podés ayudarme",
      },
    ]

    let response = ""

    try {
      for await (const chunk of streamLLM(user.uid, testMessages)) {
        response += chunk
      }

      return NextResponse.json({
        success: true,
        response,
        systemPrompt: systemPrompt.substring(0, 200) + "...", // Preview of system prompt
      })
    } catch (llmError) {
      return NextResponse.json({
        success: false,
        error: "Error conectando con el LLM: " + llmError.message,
      })
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

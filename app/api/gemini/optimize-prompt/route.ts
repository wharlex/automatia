import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"
import { decrypt } from "@/lib/secretsServer"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { currentPrompt } = await req.json()

    if (!currentPrompt) {
      return NextResponse.json(
        {
          error: "Prompt actual es requerido",
        },
        { status: 400 },
      )
    }

    const secretDoc = await adminDb.collection("secrets").doc(`${user.uid}_llm`).get()

    if (!secretDoc.exists) {
      return NextResponse.json(
        {
          error: "LLM no configurado",
        },
        { status: 400 },
      )
    }

    const secretData = secretDoc.data()
    const apiKey = decrypt(secretData.encValue)
    const provider = secretData.provider

    const optimizationPrompt = `Eres un experto en prompt engineering. Tu tarea es mejorar el siguiente system prompt para un chatbot de WhatsApp de una empresa argentina.

PROMPT ACTUAL:
${currentPrompt}

INSTRUCCIONES:
- Mantén el tono argentino y profesional
- Hazlo más específico y efectivo
- Incluye instrucciones claras sobre cómo responder
- Mantén la personalidad de la marca
- Hazlo más conciso pero completo
- Incluye manejo de casos edge (preguntas fuera de tema, etc.)

Devuelve SOLO el prompt mejorado, sin explicaciones adicionales:`

    let optimizedPrompt = ""

    if (provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: secretData.model || "gpt-4o-mini",
          messages: [{ role: "user", content: optimizationPrompt }],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error("Error optimizando prompt con OpenAI")
      }

      const data = await response.json()
      optimizedPrompt = data.choices[0].message.content
    } else if (provider === "gemini") {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${secretData.model || "gemini-1.5-flash"}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: optimizationPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1000,
            },
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Error optimizando prompt con Gemini")
      }

      const data = await response.json()
      optimizedPrompt = data.candidates[0].content.parts[0].text
    }

    return NextResponse.json({
      success: true,
      originalPrompt: currentPrompt,
      optimizedPrompt: optimizedPrompt.trim(),
      improvements: [
        "Tono más profesional y específico",
        "Instrucciones más claras",
        "Mejor manejo de casos edge",
        "Estructura optimizada",
      ],
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 },
    )
  }
}

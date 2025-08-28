import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"
import { decrypt } from "@/lib/secretsServer"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)

    const secretDoc = await adminDb.collection("secrets").doc(`${user.uid}_llm`).get()

    if (!secretDoc.exists) {
      return NextResponse.json({ error: "LLM not configured" }, { status: 400 })
    }

    const secretData = secretDoc.data()
    const apiKey = decrypt(secretData.encValue)
    const provider = secretData.provider

    // Test the connection
    if (provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error("Invalid OpenAI API key")
      }
    } else if (provider === "gemini") {
      // Test Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`)

      if (!response.ok) {
        throw new Error("Invalid Gemini API key")
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

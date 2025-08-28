import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"
import { encrypt } from "@/lib/secretsServer"

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const configDoc = await adminDb.collection("llm_config").doc(user.uid).get()

    if (!configDoc.exists) {
      return NextResponse.json({ configured: false })
    }

    const config = configDoc.data()
    return NextResponse.json({
      configured: true,
      provider: config.provider,
      model: config.model,
      temperature: config.temperature || 0.7,
      topP: config.topP || 0.9,
      maxTokens: config.maxTokens || 2048,
      contextWindow: config.contextWindow || 10,
      systemPrompt: config.systemPrompt || "",
      safetyFilters: config.safetyFilters || {
        spam: true,
        inappropriate: true,
        sentiment: false,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { provider, apiKey, model, temperature, topP, maxTokens, contextWindow, systemPrompt, safetyFilters } =
      await req.json()

    const configData = {
      provider,
      model,
      temperature: temperature || 0.7,
      topP: topP || 0.9,
      maxTokens: maxTokens || 2048,
      contextWindow: contextWindow || 10,
      systemPrompt: systemPrompt || "",
      safetyFilters: safetyFilters || {
        spam: true,
        inappropriate: true,
        sentiment: false,
      },
      updatedAt: new Date(),
    }

    // Store encrypted API key separately
    const secretData = {
      encValue: encrypt(apiKey),
      provider,
      model,
      updatedAt: new Date(),
    }

    await Promise.all([
      adminDb.collection("llm_config").doc(user.uid).set(configData),
      adminDb.collection("secrets").doc(`${user.uid}_llm`).set(secretData),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)

    const prerequisites = await checkPrerequisites(user.uid)

    if (!prerequisites.canActivate) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan requisitos para activar el bot",
          missing: prerequisites.missing,
          details: prerequisites.details,
        },
        { status: 400 },
      )
    }

    // Activate the bot
    await adminDb.collection("bot_status").doc(user.uid).set(
      {
        active: true,
        activatedAt: new Date(),
        lastActivation: new Date(),
        uptime: "00:00:00",
        version: "1.0.0",
      },
      { merge: true },
    )

    // Log activation event
    await adminDb.collection("bot_events").add({
      userId: user.uid,
      type: "activation",
      message: "Bot activated successfully",
      timestamp: new Date(),
      prerequisites: prerequisites.configured,
    })

    return NextResponse.json({
      success: true,
      message: "Bot activado correctamente",
      status: "active",
      activatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function checkPrerequisites(userId: string) {
  try {
    const [llmDoc, whatsappDoc, personalityDoc, kbStatusDoc] = await Promise.all([
      adminDb.collection("secrets").doc(`${userId}_llm`).get(),
      adminDb.collection("secrets").doc(`${userId}_whatsapp`).get(),
      adminDb.collection("bot_personality").doc(userId).get(),
      adminDb.collection("knowledge_base_status").doc(userId).get(),
    ])

    const configured = {
      llm: llmDoc.exists,
      whatsapp: whatsappDoc.exists,
      personality: personalityDoc.exists,
      knowledgeBase: kbStatusDoc.exists && kbStatusDoc.data()?.configured,
    }

    const missing = []
    const details = {}

    if (!configured.llm) {
      missing.push("LLM no configurado")
      details.llm = "Configurá OpenAI o Gemini en el paso 2"
    }

    if (!configured.whatsapp) {
      missing.push("WhatsApp no configurado")
      details.whatsapp = "Configurá WhatsApp Business API en el paso 1"
    }

    if (!configured.personality) {
      missing.push("Personalidad no configurada")
      details.personality = "Configurá la personalidad del bot en el paso 4"
    }

    // Knowledge base is optional but recommended
    if (!configured.knowledgeBase) {
      details.knowledgeBase = "Base de conocimiento no configurada (opcional)"
    }

    const canActivate = configured.llm && configured.whatsapp && configured.personality

    return {
      canActivate,
      configured,
      missing,
      details,
    }
  } catch (error) {
    console.error("[v0] Prerequisites check error:", error)
    return {
      canActivate: false,
      configured: {},
      missing: ["Error verificando requisitos"],
      details: { error: error.message },
    }
  }
}

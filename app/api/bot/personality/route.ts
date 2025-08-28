import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const personalityDoc = await adminDb.collection("bot_personality").doc(user.uid).get()

    if (!personalityDoc.exists) {
      return NextResponse.json({ configured: false })
    }

    const personality = personalityDoc.data()
    return NextResponse.json({
      configured: true,
      botName: personality.botName || "Asistente",
      communicationTone: personality.communicationTone || "amigable",
      specificInstructions: personality.specificInstructions || "",
      welcomeMessage: personality.welcomeMessage || "¡Hola! ¿En qué puedo ayudarte hoy?",
      businessHours: personality.businessHours || {
        enabled: false,
        start: "09:00",
        end: "18:00",
        timezone: "America/Argentina/Buenos_Aires",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { botName, communicationTone, specificInstructions, welcomeMessage, businessHours } = await req.json()

    const personalityData = {
      botName: botName || "Asistente",
      communicationTone: communicationTone || "amigable",
      specificInstructions: specificInstructions || "",
      welcomeMessage: welcomeMessage || "¡Hola! ¿En qué puedo ayudarte hoy?",
      businessHours: businessHours || {
        enabled: false,
        start: "09:00",
        end: "18:00",
        timezone: "America/Argentina/Buenos_Aires",
      },
      updatedAt: new Date(),
    }

    await adminDb.collection("bot_personality").doc(user.uid).set(personalityData)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

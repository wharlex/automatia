import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)

    const [secretDoc, statusDoc, messagesQuery] = await Promise.all([
      adminDb.collection("secrets").doc(`${user.uid}_whatsapp`).get(),
      adminDb.collection("bot_status").doc(user.uid).get(),
      adminDb
        .collection("whatsapp_messages")
        .where("userId", "==", user.uid)
        .orderBy("timestamp", "desc")
        .limit(10)
        .get(),
    ])

    const configured = secretDoc.exists
    const status = statusDoc.exists ? statusDoc.data() : { active: false }
    const recentMessages = messagesQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || null,
    }))

    // Get message counts for last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const dailyMessagesQuery = await adminDb
      .collection("whatsapp_messages")
      .where("userId", "==", user.uid)
      .where("timestamp", ">=", yesterday)
      .get()

    return NextResponse.json({
      configured,
      active: status.active || false,
      lastWebhook: status.lastWebhook || null,
      messages24h: dailyMessagesQuery.size,
      recentMessages,
      uptime: status.uptime || "00:00:00",
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

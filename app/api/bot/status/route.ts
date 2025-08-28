import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)

    const [botStatusDoc, llmDoc, whatsappDoc, personalityDoc, kbStatusDoc, recentEventsQuery, recentMessagesQuery] =
      await Promise.all([
        adminDb.collection("bot_status").doc(user.uid).get(),
        adminDb.collection("secrets").doc(`${user.uid}_llm`).get(),
        adminDb.collection("secrets").doc(`${user.uid}_whatsapp`).get(),
        adminDb.collection("bot_personality").doc(user.uid).get(),
        adminDb.collection("knowledge_base_status").doc(user.uid).get(),
        adminDb.collection("bot_events").where("userId", "==", user.uid).orderBy("timestamp", "desc").limit(10).get(),
        adminDb
          .collection("whatsapp_messages")
          .where("userId", "==", user.uid)
          .orderBy("timestamp", "desc")
          .limit(5)
          .get(),
      ])

    const botStatus = botStatusDoc.exists ? botStatusDoc.data() : { active: false }

    // Calculate uptime if bot is active
    let uptime = "00:00:00"
    if (botStatus.active && botStatus.activatedAt) {
      const now = new Date()
      const activated = botStatus.activatedAt.toDate()
      const diffMs = now.getTime() - activated.getTime()
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
      uptime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    // Get message counts for last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const dailyMessagesQuery = await adminDb
      .collection("whatsapp_messages")
      .where("userId", "==", user.uid)
      .where("timestamp", ">=", yesterday)
      .get()

    const components = {
      llm: {
        configured: llmDoc.exists,
        status: llmDoc.exists ? "connected" : "not_configured",
        provider: llmDoc.exists ? llmDoc.data()?.provider : null,
      },
      whatsapp: {
        configured: whatsappDoc.exists,
        status: whatsappDoc.exists ? "connected" : "not_configured",
        lastWebhook: botStatus.lastWebhook?.toDate?.()?.toISOString() || null,
      },
      personality: {
        configured: personalityDoc.exists,
        status: personalityDoc.exists ? "configured" : "not_configured",
        botName: personalityDoc.exists ? personalityDoc.data()?.botName : null,
      },
      knowledgeBase: {
        configured: kbStatusDoc.exists && kbStatusDoc.data()?.configured,
        status: kbStatusDoc.exists && kbStatusDoc.data()?.configured ? "configured" : "not_configured",
        totalDocuments: kbStatusDoc.exists ? kbStatusDoc.data()?.totalDocuments || 0 : 0,
        totalChunks: kbStatusDoc.exists ? kbStatusDoc.data()?.totalChunks || 0 : 0,
      },
    }

    const recentEvents = recentEventsQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || null,
    }))

    const recentMessages = recentMessagesQuery.docs.map((doc) => ({
      id: doc.id,
      from: doc.data().from,
      text: doc.data().text?.substring(0, 50) + "..." || "",
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || null,
      type: doc.data().type,
    }))

    return NextResponse.json({
      active: botStatus.active || false,
      uptime,
      activatedAt: botStatus.activatedAt?.toDate?.()?.toISOString() || null,
      lastActivity: botStatus.lastWebhook?.toDate?.()?.toISOString() || null,
      version: botStatus.version || "1.0.0",
      components,
      metrics: {
        messages24h: dailyMessagesQuery.size,
        totalEvents: recentEventsQuery.size,
        avgResponseTime: "2.3s", // Placeholder - would calculate from actual data
        successRate: "98.5%", // Placeholder - would calculate from actual data
      },
      recentEvents,
      recentMessages,
      health: {
        overall: components.llm.configured && components.whatsapp.configured ? "healthy" : "degraded",
        issues: [
          !components.llm.configured && "LLM not configured",
          !components.whatsapp.configured && "WhatsApp not configured",
          !components.personality.configured && "Personality not configured",
        ].filter(Boolean),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

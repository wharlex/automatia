import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const workspaceId = user.workspaceId || 'default'

    // Obtener estadísticas de conversaciones
    const conversationsSnapshot = await adminDb
      .collection('workspaces')
      .doc(workspaceId)
      .collection('conversations')
      .get()

    const conversations = conversationsSnapshot.docs.map(doc => doc.data())
    const totalConversations = conversations.length
    const activeConversations = conversations.filter(conv => conv.status === 'active').length
    
    // Calcular total de mensajes
    const totalMessages = conversations.reduce((total, conv) => {
      return total + (conv.messages?.length || 0)
    }, 0)

    // Calcular tiempo de respuesta promedio (simulado por ahora)
    const responseTime = 2.5

    // Calcular tasa de satisfacción (simulada por ahora)
    const satisfactionRate = 92

    // Verificar estado de WhatsApp
    const whatsappConfig = await adminDb
      .collection('workspaces')
      .doc(workspaceId)
      .collection('whatsapp')
      .doc('config')
      .get()

    const whatsappConnected = whatsappConfig.exists && whatsappConfig.data()?.isConnected

    // Verificar estado de IA
    const aiConfig = await adminDb
      .collection('workspaces')
      .doc(workspaceId)
      .collection('ai')
      .doc('config')
      .get()

    const aiConfigured = aiConfig.exists && aiConfig.data()?.isActive

    // Obtener total de flujos
    const flowsSnapshot = await adminDb
      .collection('workspaces')
      .doc(workspaceId)
      .collection('flows')
      .get()

    const totalFlows = flowsSnapshot.size

    // Obtener total de documentos de conocimiento
    const knowledgeSnapshot = await adminDb
      .collection('workspaces')
      .doc(workspaceId)
      .collection('knowledge')
      .get()

    const totalKnowledgeDocs = knowledgeSnapshot.size

    const stats = {
      totalConversations,
      activeConversations,
      totalMessages,
      responseTime,
      satisfactionRate,
      whatsappConnected,
      aiConfigured,
      totalFlows,
      totalKnowledgeDocs
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error("[Dashboard Stats] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

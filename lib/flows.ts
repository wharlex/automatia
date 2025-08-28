import { adminDb } from "./firebaseAdmin"
import { WhatsAppService } from "./whatsapp"

export interface FlowResult {
  type: "lead" | "support" | "appointment" | "none"
  action?: string
  data?: any
  message?: string
}

export interface LeadData {
  name: string
  phone?: string
  email?: string
  interest: string
  source: "web" | "whatsapp"
  userId: string
}

export interface SupportTicket {
  userId: string
  userQuery: string
  category: string
  priority: "low" | "medium" | "high"
  status: "open" | "resolved" | "escalated"
  source: "web" | "whatsapp"
}

export class FlowProcessor {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async detectIntent(userMessage: string, conversationHistory: any[]): Promise<FlowResult> {
    const message = userMessage.toLowerCase()

    // Lead capture detection
    if (this.isLeadIntent(message)) {
      return {
        type: "lead",
        action: "capture",
        message:
          "Perfecto! Me gustaría ayudarte. ¿Podrías contarme tu nombre y en qué estás interesado específicamente?",
      }
    }

    // Support detection
    if (this.isSupportIntent(message)) {
      return {
        type: "support",
        action: "search_kb",
        message: "Entiendo que necesitás ayuda. Dejame buscar información que pueda serte útil.",
      }
    }

    // Appointment detection
    if (this.isAppointmentIntent(message)) {
      return {
        type: "appointment",
        action: "schedule",
        message:
          "¡Genial! Te paso el link para que puedas agendar una reunión: https://calendly.com/automatia o si preferís, en breve te contactamos nosotros.",
      }
    }

    return { type: "none" }
  }

  private isLeadIntent(message: string): boolean {
    const leadKeywords = [
      "quiero más información",
      "me interesa",
      "cotización",
      "precio",
      "contratar",
      "necesito",
      "busco",
      "quisiera saber",
      "información",
      "presupuesto",
      "demo",
      "prueba",
      "contacto",
      "llamar",
      "hablar",
    ]
    return leadKeywords.some((keyword) => message.includes(keyword))
  }

  private isSupportIntent(message: string): boolean {
    const supportKeywords = [
      "problema",
      "error",
      "no funciona",
      "ayuda",
      "soporte",
      "técnico",
      "bug",
      "falla",
      "issue",
      "roto",
      "mal",
      "arreglar",
      "solucionar",
    ]
    return supportKeywords.some((keyword) => message.includes(keyword))
  }

  private isAppointmentIntent(message: string): boolean {
    const appointmentKeywords = [
      "reunión",
      "cita",
      "agendar",
      "calendario",
      "meeting",
      "llamada",
      "videollamada",
      "zoom",
      "meet",
      "hablar",
      "conversar",
      "charlar",
    ]
    return appointmentKeywords.some((keyword) => message.includes(keyword))
  }

  async processLead(leadData: LeadData): Promise<{ success: boolean; message: string }> {
    try {
      // Save lead to Firestore
      const leadDoc = {
        ...leadData,
        createdAt: new Date(),
        status: "new",
        processed: false,
      }

      const docRef = await adminDb.collection("leads").add(leadDoc)

      // Send confirmation based on source
      if (leadData.source === "whatsapp" && leadData.phone) {
        await this.sendWhatsAppConfirmation(leadData.phone, leadData.name)
      }

      // Send internal notification
      await this.sendLeadNotification(leadData)

      return {
        success: true,
        message: `¡Perfecto, ${leadData.name}! Recibimos tu consulta sobre ${leadData.interest}. Te vamos a contactar en las próximas horas. ¡Gracias por tu interés en Automatía!`,
      }
    } catch (error) {
      console.error("Error processing lead:", error)
      return {
        success: false,
        message: "Hubo un error guardando tu información. Por favor intentá de nuevo o contactanos directamente.",
      }
    }
  }

  async processSupport(ticket: SupportTicket): Promise<{ success: boolean; message: string; escalated?: boolean }> {
    try {
      // Search knowledge base (placeholder for now)
      const kbResult = await this.searchKnowledgeBase(ticket.userQuery)

      if (kbResult.found) {
        // Save resolved ticket
        await adminDb.collection("support_tickets").add({
          ...ticket,
          createdAt: new Date(),
          resolvedAt: new Date(),
          resolution: kbResult.answer,
          resolvedBy: "kb_search",
        })

        return {
          success: true,
          message: `Encontré información que puede ayudarte:\n\n${kbResult.answer}\n\n¿Esto resuelve tu consulta? Si necesitás más ayuda, decime y te paso con un especialista.`,
        }
      } else {
        // Escalate to human
        await this.escalateToHuman(ticket)

        return {
          success: true,
          message:
            "Te paso con un asesor especializado que va a poder ayudarte mejor. En breve te contactamos para resolver tu consulta.",
          escalated: true,
        }
      }
    } catch (error) {
      console.error("Error processing support:", error)
      return {
        success: false,
        message: "Hubo un error procesando tu consulta. Te paso con un especialista que te va a ayudar.",
      }
    }
  }

  private async sendWhatsAppConfirmation(phone: string, name: string): Promise<void> {
    try {
      const whatsapp = await WhatsAppService.fromUserId(this.userId)
      await whatsapp.sendMessage({
        to: phone,
        type: "text",
        text: {
          body: `¡Hola ${name}! Confirmamos que recibimos tu consulta. Nuestro equipo te va a contactar en las próximas horas. ¡Gracias por elegir Automatía! 🤖`,
        },
      })
    } catch (error) {
      console.error("Error sending WhatsApp confirmation:", error)
    }
  }

  private async sendLeadNotification(leadData: LeadData): Promise<void> {
    try {
      // Send email notification to internal team
      const emailContent = `
        Nuevo lead capturado:
        
        Nombre: ${leadData.name}
        Teléfono: ${leadData.phone || "No proporcionado"}
        Email: ${leadData.email || "No proporcionado"}
        Interés: ${leadData.interest}
        Fuente: ${leadData.source}
        Fecha: ${new Date().toLocaleString("es-AR")}
      `

      // TODO: Implement email sending service
      console.log("[v0] Lead notification:", emailContent)
    } catch (error) {
      console.error("Error sending lead notification:", error)
    }
  }

  private async searchKnowledgeBase(query: string): Promise<{ found: boolean; answer?: string }> {
    try {
      const response = await fetch(`/api/knowledge-base/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ query, topK: 3 }),
      })

      if (!response.ok) {
        console.error("[v0] Knowledge base search failed:", response.statusText)
        return this.fallbackKeywordSearch(query)
      }

      const searchResult = await response.json()

      if (searchResult.found && searchResult.context) {
        // Use LLM to generate a natural response based on the context
        const answer = await this.generateContextualAnswer(query, searchResult.context)
        return { found: true, answer }
      }

      // Fallback to keyword search if RAG doesn't find anything
      return this.fallbackKeywordSearch(query)
    } catch (error) {
      console.error("[v0] Knowledge base search error:", error)
      return this.fallbackKeywordSearch(query)
    }
  }

  private async generateContextualAnswer(query: string, context: string): Promise<string> {
    try {
      // Get LLM configuration
      const secretDoc = await adminDb.collection("secrets").doc(`${this.userId}_llm`).get()

      if (!secretDoc.exists) {
        return context // Return raw context if no LLM configured
      }

      const prompt = `Basándote en la siguiente información de la empresa, responde la pregunta del cliente de manera natural y útil:

INFORMACIÓN DE LA EMPRESA:
${context}

PREGUNTA DEL CLIENTE:
${query}

INSTRUCCIONES:
- Responde en tono amigable y profesional
- Usa solo la información proporcionada
- Si no tenés información suficiente, decilo claramente
- Mantené el tono argentino
- Sé conciso pero completo

RESPUESTA:`

      // This would use the LLM streaming function, but for now return a formatted response
      const lines = context.split("\n").filter((line) => line.trim())
      const relevantInfo = lines.slice(0, 3).join(" ")

      return `Según nuestra información: ${relevantInfo}. ¿Te ayuda esto con tu consulta?`
    } catch (error) {
      console.error("[v0] Error generating contextual answer:", error)
      return context
    }
  }

  private async getAuthToken(): Promise<string> {
    // In a real implementation, this would get the Firebase auth token
    // For now, return a placeholder
    return "placeholder-token"
  }

  private fallbackKeywordSearch(query: string): { found: boolean; answer?: string } {
    const kb = [
      {
        keywords: ["precio", "costo", "cuanto", "tarifa"],
        answer:
          "Nuestros planes arrancan desde $50/mes para el plan básico. Incluye chatbot IA, integración WhatsApp y soporte 24/7. ¿Te gustaría que te mande más detalles?",
      },
      {
        keywords: ["horario", "atención", "cuando"],
        answer:
          "Nuestro chatbot funciona 24/7, pero nuestro equipo humano atiende de Lunes a Viernes de 9 a 18hs. Los fines de semana respondemos consultas urgentes.",
      },
      {
        keywords: ["whatsapp", "integrar", "conectar"],
        answer:
          "La integración con WhatsApp es súper fácil. Te ayudamos con todo el setup y en 24hs tenés tu chatbot funcionando. ¿Querés que te mostremos cómo?",
      },
      {
        keywords: ["demo", "prueba", "test"],
        answer:
          "¡Por supuesto! Podés probar nuestro chatbot gratis por 7 días. Te configuramos todo y si no te convence, no pagás nada. ¿Arrancamos?",
      },
    ]

    const queryLower = query.toLowerCase()

    for (const item of kb) {
      if (item.keywords.some((keyword) => queryLower.includes(keyword))) {
        return { found: true, answer: item.answer }
      }
    }

    return { found: false }
  }

  private async escalateToHuman(ticket: SupportTicket): Promise<void> {
    try {
      // Save escalated ticket
      await adminDb.collection("support_tickets").add({
        ...ticket,
        createdAt: new Date(),
        escalatedAt: new Date(),
        escalatedTo: "human_support",
      })

      // Send notification to support team
      const notificationContent = `
        Ticket escalado a soporte humano:
        
        Usuario: ${ticket.userId}
        Consulta: ${ticket.userQuery}
        Categoría: ${ticket.category}
        Prioridad: ${ticket.priority}
        Fuente: ${ticket.source}
        Fecha: ${new Date().toLocaleString("es-AR")}
      `

      // TODO: Implement support team notification
      console.log("[v0] Support escalation:", notificationContent)
    } catch (error) {
      console.error("Error escalating to human:", error)
    }
  }
}

export async function extractLeadData(conversation: string, source: "web" | "whatsapp"): Promise<LeadData | null> {
  // Simple extraction logic - in production, use more sophisticated NLP
  const nameMatch = conversation.match(/(?:me llamo|soy|mi nombre es)\s+([a-záéíóúñ\s]+)/i)
  const phoneMatch = conversation.match(/(?:mi teléfono es|mi número es|llamame al)\s*(\+?[\d\s-]+)/i)
  const emailMatch = conversation.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)

  // Extract interest from context
  const interestKeywords = ["chatbot", "automatización", "whatsapp", "ia", "inteligencia artificial", "bot"]
  const interest =
    interestKeywords.find((keyword) => conversation.toLowerCase().includes(keyword)) || "servicios de automatía"

  if (nameMatch) {
    return {
      name: nameMatch[1].trim(),
      phone: phoneMatch?.[1]?.replace(/\s/g, ""),
      email: emailMatch?.[1],
      interest,
      source,
      userId: "", // Will be set by the caller
    }
  }

  return null
}

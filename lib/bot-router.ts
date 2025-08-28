import { adminDb } from "./firebaseAdmin"
import { FlowProcessor, type FlowResult } from "./flows"
import { streamLLM, type ChatMessage } from "./llm"
import { WhatsAppService } from "./whatsapp"

export interface BotPersonality {
  botName: string
  communicationTone: "profesional" | "amigable" | "casual" | "entusiasta"
  specificInstructions: string
  welcomeMessage: string
  businessHours: {
    enabled: boolean
    start: string
    end: string
    timezone: string
  }
}

export interface RouterContext {
  userId: string
  source: "web" | "whatsapp"
  userPhone?: string
  conversationHistory: ChatMessage[]
}

export class BotRouter {
  private userId: string
  private flowProcessor: FlowProcessor

  constructor(userId: string) {
    this.userId = userId
    this.flowProcessor = new FlowProcessor(userId)
  }

  async processMessage(context: RouterContext, userMessage: string): Promise<string> {
    try {
      // Step 1: Check business hours
      const businessHoursCheck = await this.checkBusinessHours()
      if (!businessHoursCheck.isOpen && businessHoursCheck.enabled) {
        return businessHoursCheck.message
      }

      // Step 2: Detect intent using flow processor
      const flowResult = await this.flowProcessor.detectIntent(userMessage, context.conversationHistory)

      // Step 3: Process specific flows
      if (flowResult.type !== "none") {
        const flowResponse = await this.processFlow(flowResult, userMessage, context)
        if (flowResponse) {
          return flowResponse
        }
      }

      // Step 4: Generate system prompt with personality
      const systemPrompt = await generateSystemPrompt(this.userId)

      // Step 5: Use LLM with RAG for general conversation
      const messages: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...context.conversationHistory,
        { role: "user", content: userMessage },
      ]

      let response = ""
      for await (const chunk of streamLLM(this.userId, messages)) {
        response += chunk
      }

      return response
    } catch (error) {
      console.error("[v0] Bot router error:", error)
      return "Disculpá, hubo un error procesando tu mensaje. ¿Podés intentar de nuevo?"
    }
  }

  private async checkBusinessHours(): Promise<{ isOpen: boolean; enabled: boolean; message: string }> {
    try {
      const personalityDoc = await adminDb.collection("bot_personality").doc(this.userId).get()

      if (!personalityDoc.exists) {
        return { isOpen: true, enabled: false, message: "" }
      }

      const personality = personalityDoc.data() as BotPersonality

      if (!personality.businessHours?.enabled) {
        return { isOpen: true, enabled: false, message: "" }
      }

      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const currentTime = currentHour * 60 + currentMinute

      const [startHour, startMinute] = personality.businessHours.start.split(":").map(Number)
      const [endHour, endMinute] = personality.businessHours.end.split(":").map(Number)

      const startTime = startHour * 60 + startMinute
      const endTime = endHour * 60 + endMinute

      const isOpen = currentTime >= startTime && currentTime <= endTime

      if (!isOpen) {
        return {
          isOpen: false,
          enabled: true,
          message: `Gracias por contactarte. Nuestro horario de atención es de ${personality.businessHours.start} a ${personality.businessHours.end}hs. Te vamos a responder apenas abramos. ¡Que tengas un buen día!`,
        }
      }

      return { isOpen: true, enabled: true, message: "" }
    } catch (error) {
      console.error("[v0] Business hours check error:", error)
      return { isOpen: true, enabled: false, message: "" }
    }
  }

  private async processFlow(
    flowResult: FlowResult,
    userMessage: string,
    context: RouterContext,
  ): Promise<string | null> {
    try {
      if (flowResult.type === "lead") {
        // Extract lead data from conversation
        const conversationText = context.conversationHistory.map((m) => m.content).join(" ") + " " + userMessage
        const { extractLeadData } = await import("./flows")
        const leadData = await extractLeadData(conversationText, context.source)

        if (leadData) {
          leadData.userId = this.userId
          const result = await this.flowProcessor.processLead(leadData)
          return result.message
        }

        return flowResult.message || "Perfecto! ¿Podrías contarme tu nombre y en qué estás interesado específicamente?"
      }

      if (flowResult.type === "support") {
        const supportTicket = {
          userId: this.userId,
          userQuery: userMessage,
          category: "general",
          priority: "medium" as const,
          status: "open" as const,
          source: context.source,
        }

        const result = await this.flowProcessor.processSupport(supportTicket)
        return result.message
      }

      if (flowResult.type === "appointment") {
        return flowResult.message || "¡Genial! Te paso el link para agendar: https://calendly.com/automatia"
      }

      return null
    } catch (error) {
      console.error("[v0] Flow processing error:", error)
      return null
    }
  }
}

export async function generateSystemPrompt(userId: string): Promise<string> {
  try {
    const [personalityDoc, configDoc, kbStatusDoc] = await Promise.all([
      adminDb.collection("bot_personality").doc(userId).get(),
      adminDb.collection("llm_config").doc(userId).get(),
      adminDb.collection("knowledge_base_status").doc(userId).get(),
    ])

    const personality = personalityDoc.exists ? (personalityDoc.data() as BotPersonality) : null
    const config = configDoc.exists ? configDoc.data() : null
    const kbStatus = kbStatusDoc.exists ? kbStatusDoc.data() : null

    const botName = personality?.botName || "Asistente"
    const tone = personality?.communicationTone || "amigable"
    const customInstructions = personality?.specificInstructions || ""
    const hasKnowledgeBase = kbStatus?.configured && kbStatus?.totalChunks > 0

    const toneInstructions = {
      profesional: "Mantené un tono profesional y formal. Usá 'usted' y evitá jerga.",
      amigable: "Sé amigable y cercano. Usá 'vos' y un tono cálido pero profesional.",
      casual: "Hablá de manera relajada y natural. Usá expresiones argentinas comunes.",
      entusiasta: "Mostrá energía y entusiasmo. Usá emojis ocasionalmente y sé motivador.",
    }

    const systemPrompt = `Sos ${botName}, el asistente virtual inteligente de esta empresa.

PERSONALIDAD Y TONO:
${toneInstructions[tone]}

INSTRUCCIONES PRINCIPALES:
- Respondé siempre en español argentino
- Sé útil, claro y directo
- Si no sabés algo, decilo honestamente
- Proponé acciones concretas cuando sea posible
- Mantené la conversación enfocada en ayudar al usuario

CAPACIDADES:
- Responder preguntas sobre la empresa y sus servicios
- Capturar leads interesados en productos/servicios
- Brindar soporte básico y derivar casos complejos
- Agendar reuniones o llamadas
${hasKnowledgeBase ? "- Buscar información en la base de conocimiento de la empresa" : ""}

DETECCIÓN DE INTENCIONES:
1. LEAD CAPTURE: Si el usuario muestra interés (precios, información, contratar, demo)
   → Pedí nombre, interés específico, y datos de contacto
   
2. SOPORTE: Si reporta problemas o necesita ayuda técnica
   → Intentá resolver con información disponible, sino derivá a humano
   
3. CITAS: Si quiere reunirse, hablar por teléfono, o agendar
   → Ofrecé opciones de contacto o calendario

${customInstructions ? `\nINSTRUCCIONES ESPECÍFICAS:\n${customInstructions}` : ""}

IMPORTANTE: Siempre mantené el tono ${tone} y actuá como ${botName}. Si detectás una intención específica, seguí el flujo correspondiente.`

    return systemPrompt
  } catch (error) {
    console.error("[v0] Error generating system prompt:", error)
    return "Sos un asistente virtual inteligente. Respondé de manera útil y profesional en español argentino."
  }
}

export async function processWhatsAppMessage(userId: string, message: any): Promise<void> {
  try {
    const router = new BotRouter(userId)

    // Get conversation history (last 10 messages)
    const historyQuery = await adminDb
      .collection("whatsapp_messages")
      .where("userId", "==", userId)
      .where("from", "==", message.from)
      .orderBy("timestamp", "desc")
      .limit(10)
      .get()

    const conversationHistory: ChatMessage[] = historyQuery.docs.reverse().map((doc) => {
      const data = doc.data()
      return {
        role: data.type === "outgoing" ? "assistant" : "user",
        content: data.text || "",
      }
    })

    const context: RouterContext = {
      userId,
      source: "whatsapp",
      userPhone: message.from,
      conversationHistory,
    }

    const response = await router.processMessage(context, message.text?.body || "")

    // Send response via WhatsApp
    const whatsapp = await WhatsAppService.fromUserId(userId)
    await whatsapp.sendMessage({
      to: message.from,
      type: "text",
      text: { body: response },
    })

    // Log outgoing message
    await adminDb.collection("whatsapp_messages").add({
      userId,
      messageId: `out_${Date.now()}`,
      from: "bot",
      to: message.from,
      text: response,
      type: "outgoing",
      timestamp: new Date(),
      processed: true,
    })
  } catch (error) {
    console.error("[v0] WhatsApp message processing error:", error)

    // Send error message
    try {
      const whatsapp = await WhatsAppService.fromUserId(userId)
      await whatsapp.sendMessage({
        to: message.from,
        type: "text",
        text: { body: "Disculpá, hubo un error. En breve te contactamos." },
      })
    } catch (sendError) {
      console.error("[v0] Error sending error message:", sendError)
    }
  }
}

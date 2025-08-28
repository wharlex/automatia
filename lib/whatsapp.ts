import { adminDb } from "./firebaseAdmin"
import { decrypt } from "./secretsServer"

export interface WhatsAppConfig {
  metaAppId: string
  metaAppSecret: string
  wabaId: string
  phoneNumberId: string
  permanentToken: string
  webhookVerifyToken: string
}

export interface WhatsAppMessage {
  to: string
  type: "text" | "template"
  text?: { body: string }
  template?: {
    name: string
    language: { code: string }
    components?: any[]
  }
}

export class WhatsAppService {
  private config: WhatsAppConfig
  private baseUrl = "https://graph.facebook.com/v18.0"

  constructor(config: WhatsAppConfig) {
    this.config = config
  }

  static async fromUserId(userId: string): Promise<WhatsAppService> {
    const secretDoc = await adminDb.collection("secrets").doc(`${userId}_whatsapp`).get()

    if (!secretDoc.exists) {
      throw new Error("WhatsApp not configured")
    }

    const secretData = secretDoc.data()
    const config: WhatsAppConfig = {
      metaAppId: decrypt(secretData.metaAppId),
      metaAppSecret: decrypt(secretData.metaAppSecret),
      wabaId: decrypt(secretData.wabaId),
      phoneNumberId: decrypt(secretData.phoneNumberId),
      permanentToken: decrypt(secretData.permanentToken),
      webhookVerifyToken: decrypt(secretData.webhookVerifyToken),
    }

    return new WhatsAppService(config)
  }

  async sendMessage(message: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.permanentToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error?.message || "Failed to send message" }
      }

      return { success: true, messageId: data.messages?.[0]?.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async sendTestMessage(testNumber: string): Promise<{ success: boolean; error?: string }> {
    const message: WhatsAppMessage = {
      to: testNumber,
      type: "text",
      text: { body: "🤖 Mensaje de prueba desde Automatía. Tu WhatsApp está configurado correctamente." },
    }

    const result = await this.sendMessage(message)
    return { success: result.success, error: result.error }
  }

  async getTemplates(): Promise<{ templates: any[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.config.wabaId}/message_templates`, {
        headers: {
          Authorization: `Bearer ${this.config.permanentToken}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return { templates: [], error: data.error?.message || "Failed to get templates" }
      }

      return { templates: data.data || [] }
    } catch (error) {
      return { templates: [], error: error.message }
    }
  }

  generateWebhookUrl(userId: string): string {
    return `${process.env.NEXT_PUBLIC_APP_URL || "https://automatia.ar"}/api/webhooks/whatsapp/${userId}`
  }

  async testConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      // Test 1: Verify phone number access
      const phoneResponse = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}`, {
        headers: {
          Authorization: `Bearer ${this.config.permanentToken}`,
        },
      })

      if (!phoneResponse.ok) {
        const phoneError = await phoneResponse.json()
        return {
          success: false,
          error: "Token inválido o permisos faltantes",
          details: phoneError.error?.message,
        }
      }

      const phoneData = await phoneResponse.json()

      // Test 2: Verify WABA access
      const wabaResponse = await fetch(`${this.baseUrl}/${this.config.wabaId}`, {
        headers: {
          Authorization: `Bearer ${this.config.permanentToken}`,
        },
      })

      if (!wabaResponse.ok) {
        return {
          success: false,
          error: "WABA ID incorrecto o sin acceso",
        }
      }

      return {
        success: true,
        details: {
          phoneNumber: phoneData.display_phone_number,
          phoneStatus: phoneData.verified_name,
          wabaId: this.config.wabaId,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: "Error de conexión con WhatsApp API",
        details: error.message,
      }
    }
  }

  async sendMessageWithRetry(
    message: WhatsAppMessage,
    maxRetries = 3,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    let lastError = ""

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.sendMessage(message)

      if (result.success) {
        return result
      }

      lastError = result.error || "Unknown error"

      // Check if it's a rate limit error
      if (lastError.includes("rate limit") || lastError.includes("429")) {
        const backoffDelay = Math.pow(2, attempt) * 1000 // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, backoffDelay))
        continue
      }

      // For non-rate-limit errors, don't retry
      break
    }

    return { success: false, error: lastError }
  }
}

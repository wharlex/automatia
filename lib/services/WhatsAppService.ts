import { decryptSecret } from '@/lib/crypto'
import { LogService } from './LogService'

interface WhatsAppConfig {
  phoneNumberId: string
  wabaId: string
  accessToken: string
  verifyToken: string
  appId: string
  appSecret: string
  graphVersion: string
  mode: 'sandbox' | 'live'
}

interface MessageResponse {
  success: boolean
  messageId?: string
  error?: string
  details?: any
}

interface MediaUploadResponse {
  success: boolean
  mediaId?: string
  error?: string
}

export class WhatsAppService {
  private config: WhatsAppConfig
  private baseUrl: string
  private logService: LogService

  constructor(config?: Partial<WhatsAppConfig>) {
    this.config = {
      phoneNumberId: config?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      wabaId: config?.wabaId || process.env.WHATSAPP_WABA_ID || '',
      accessToken: config?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || '',
      verifyToken: config?.verifyToken || process.env.WHATSAPP_VERIFY_TOKEN || '',
      appId: config?.appId || process.env.WHATSAPP_APP_ID || '',
      appSecret: config?.appSecret || process.env.WHATSAPP_APP_SECRET || '',
      graphVersion: config?.graphVersion || 'v21.0',
      mode: (config?.mode || process.env.WHATSAPP_MODE || 'sandbox') as 'sandbox' | 'live'
    }
    
    this.baseUrl = `https://graph.facebook.com/${this.config.graphVersion}`
    this.logService = new LogService()
  }

  /**
   * Send text message via WhatsApp
   */
  async sendText(to: string, text: string, replyToMessageId?: string): Promise<MessageResponse> {
    try {
      const messageData: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body: text }
      }

      if (replyToMessageId) {
        messageData.context = { message_id: replyToMessageId }
      }

      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })

      const result = await response.json()

      if (!response.ok) {
        this.logService.error('WhatsApp send text failed', result, { to, text })
        return {
          success: false,
          error: result.error?.message || 'Failed to send message',
          details: result
        }
      }

      this.logService.info('WhatsApp text message sent successfully', { 
        to, 
        messageId: result.messages?.[0]?.id 
      })

      return {
        success: true,
        messageId: result.messages?.[0]?.id
      }

    } catch (error) {
      this.logService.error('WhatsApp send text error', error, { to, text })
      return {
        success: false,
        error: error.message || 'Network error'
      }
    }
  }

  /**
   * Send image message via WhatsApp
   */
  async sendImage(to: string, imageUrl: string, caption?: string, replyToMessageId?: string): Promise<MessageResponse> {
    try {
      const messageData: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'image',
        image: { link: imageUrl }
      }

      if (caption) {
        messageData.image.caption = caption
      }

      if (replyToMessageId) {
        messageData.context = { message_id: replyToMessageId }
      }

      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })

      const result = await response.json()

      if (!response.ok) {
        this.logService.error('WhatsApp send image failed', result, { to, imageUrl })
        return {
          success: false,
          error: result.error?.message || 'Failed to send image',
          details: result
        }
      }

      this.logService.info('WhatsApp image message sent successfully', { 
        to, 
        messageId: result.messages?.[0]?.id 
      })

      return {
        success: true,
        messageId: result.messages?.[0]?.id
      }

    } catch (error) {
      this.logService.error('WhatsApp send image error', error, { to, imageUrl })
      return {
        success: false,
        error: error.message || 'Network error'
      }
    }
  }

  /**
   * Send document message via WhatsApp
   */
  async sendDocument(to: string, documentUrl: string, filename: string, caption?: string): Promise<MessageResponse> {
    try {
      const messageData: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'document',
        document: { 
          link: documentUrl,
          filename
        }
      }

      if (caption) {
        messageData.document.caption = caption
      }

      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })

      const result = await response.json()

      if (!response.ok) {
        this.logService.error('WhatsApp send document failed', result, { to, documentUrl })
        return {
          success: false,
          error: result.error?.message || 'Failed to send document',
          details: result
        }
      }

      this.logService.info('WhatsApp document message sent successfully', { 
        to, 
        messageId: result.messages?.[0]?.id 
      })

      return {
        success: true,
        messageId: result.messages?.[0]?.id
      }

    } catch (error) {
      this.logService.error('WhatsApp send document error', error, { to, documentUrl })
      return {
        success: false,
        error: error.message || 'Network error'
      }
    }
  }

  /**
   * Send audio message via WhatsApp
   */
  async sendAudio(to: string, audioUrl: string, replyToMessageId?: string): Promise<MessageResponse> {
    try {
      const messageData: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'audio',
        audio: { link: audioUrl }
      }

      if (replyToMessageId) {
        messageData.context = { message_id: replyToMessageId }
      }

      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })

      const result = await response.json()

      if (!response.ok) {
        this.logService.error('WhatsApp send audio failed', result, { to, audioUrl })
        return {
          success: false,
          error: result.error?.message || 'Failed to send audio',
          details: result
        }
      }

      this.logService.info('WhatsApp audio message sent successfully', { 
        to, 
        messageId: result.messages?.[0]?.id 
      })

      return {
        success: true,
        messageId: result.messages?.[0]?.id
      }

    } catch (error) {
      this.logService.error('WhatsApp send audio error', error, { to, audioUrl })
      return {
        success: false,
        error: error.message || 'Network error'
      }
    }
  }

  /**
   * Send template message (for business verification)
   */
  async sendTemplate(to: string, templateName: string, languageCode: string = 'es', components?: any[]): Promise<MessageResponse> {
    try {
      const messageData: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode }
        }
      }

      if (components && components.length > 0) {
        messageData.template.components = components
      }

      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })

      const result = await response.json()

      if (!response.ok) {
        this.logService.error('WhatsApp send template failed', result, { to, templateName })
        return {
          success: false,
          error: result.error?.message || 'Failed to send template',
          details: result
        }
      }

      this.logService.info('WhatsApp template message sent successfully', { 
        to, 
        templateName,
        messageId: result.messages?.[0]?.id 
      })

      return {
        success: true,
        messageId: result.messages?.[0]?.id
      }

    } catch (error) {
      this.logService.error('WhatsApp send template error', error, { to, templateName })
      return {
        success: false,
        error: error.message || 'Network error'
      }
    }
  }

  /**
   * Upload media to WhatsApp
   */
  async uploadMedia(fileUrl: string, mimeType: string): Promise<MediaUploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          file_url: fileUrl,
          type: mimeType
        })
      })

      const result = await response.json()

      if (!response.ok) {
        this.logService.error('WhatsApp media upload failed', result, { fileUrl, mimeType })
        return {
          success: false,
          error: result.error?.message || 'Failed to upload media',
          details: result
        }
      }

      this.logService.info('WhatsApp media uploaded successfully', { 
        mediaId: result.id,
        mimeType 
      })

      return {
        success: true,
        mediaId: result.id
      }

    } catch (error) {
      this.logService.error('WhatsApp media upload error', error, { fileUrl, mimeType })
      return {
        success: false,
        error: error.message || 'Network error'
      }
    }
  }

  /**
   * Get media URL for download
   */
  async getMediaUrl(mediaId: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${mediaId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      })

      if (!response.ok) {
        this.logService.error('Failed to get media URL', { mediaId, status: response.status })
        return null
      }

      const result = await response.json()
      return result.url || null

    } catch (error) {
      this.logService.error('Error getting media URL', error, { mediaId })
      return null
    }
  }

  /**
   * Download media content
   */
  async downloadMedia(mediaId: string): Promise<Buffer | null> {
    try {
      const mediaUrl = await this.getMediaUrl(mediaId)
      if (!mediaUrl) return null

      const response = await fetch(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      })

      if (!response.ok) {
        this.logService.error('Failed to download media', { mediaId, status: response.status })
        return null
      }

      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)

    } catch (error) {
      this.logService.error('Error downloading media', error, { mediaId })
      return null
    }
  }

  /**
   * Get business account info
   */
  async getBusinessInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.config.wabaId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      })

      if (!response.ok) {
        this.logService.error('Failed to get business info', { status: response.status })
        return null
      }

      return await response.json()

    } catch (error) {
      this.logService.error('Error getting business info', error)
      return null
    }
  }

  /**
   * Get phone number info
   */
  async getPhoneNumberInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      })

      if (!response.ok) {
        this.logService.error('Failed to get phone number info', { status: response.status })
        return null
      }

      return await response.json()

    } catch (error) {
      this.logService.error('Error getting phone number info', error)
      return null
    }
  }

  /**
   * Verify webhook signature
   */
  verifySignature(body: string, signature: string, appSecret: string): boolean {
    try {
      const crypto = require('crypto')
      const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', appSecret)
        .update(body)
        .digest('hex')
      
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    } catch (error) {
      this.logService.error('Signature verification error', error)
      return false
    }
  }

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.config.phoneNumberId && this.config.accessToken && this.config.wabaId)
  }

  /**
   * Get current configuration (without sensitive data)
   */
  getConfig(): Omit<WhatsAppConfig, 'accessToken' | 'appSecret'> {
    const { accessToken, appSecret, ...safeConfig } = this.config
    return safeConfig
  }
}



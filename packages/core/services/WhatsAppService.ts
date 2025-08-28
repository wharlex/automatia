export class WhatsAppService {
  async sendMessage(phoneNumber: string, message: string, options: any = {}) {
    try {
      // This is a simplified implementation
      // In production, you'd integrate with actual WhatsApp Business API
      
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          message,
          ...options
        })
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async sendTemplate(phoneNumber: string, templateName: string, variables: any = {}) {
    try {
      const response = await fetch('/api/whatsapp/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          templateName,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`WhatsApp template API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending WhatsApp template:', error);
      throw error;
    }
  }

  async getMessageStatus(messageId: string) {
    try {
      const response = await fetch(`/api/whatsapp/status/${messageId}`);

      if (!response.ok) {
        throw new Error(`WhatsApp status API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting WhatsApp message status:', error);
      throw error;
    }
  }

  async getWebhookEvents(limit: number = 100) {
    try {
      const response = await fetch(`/api/whatsapp/webhooks?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`WhatsApp webhooks API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting WhatsApp webhook events:', error);
      throw error;
    }
  }
}

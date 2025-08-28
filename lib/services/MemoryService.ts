import { ChatMessage } from './AIService'

export interface MemoryEntry {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export class MemoryService {
  private readonly MAX_WINDOW_SIZE = 10

  async getMemory(businessId: string, waId: string): Promise<ChatMessage[]> {
    try {
      // In a real implementation, this would fetch from database
      // For now, return empty array
      return []
    } catch (error) {
      console.error('Error getting memory:', error)
      return []
    }
  }

  async addToMemory(businessId: string, waId: string, message: ChatMessage): Promise<void> {
    try {
      // In a real implementation, this would save to database
      // For now, just log
      console.log(`Adding to memory for ${businessId}:${waId}:`, message)
    } catch (error) {
      console.error('Error adding to memory:', error)
    }
  }

  async updateMemory(businessId: string, waId: string, messages: ChatMessage[]): Promise<void> {
    try {
      // Keep only the last MAX_WINDOW_SIZE messages
      const trimmedMessages = messages.slice(-this.MAX_WINDOW_SIZE)
      
      // In a real implementation, this would update the database
      console.log(`Updating memory for ${businessId}:${waId} with ${trimmedMessages.length} messages`)
    } catch (error) {
      console.error('Error updating memory:', error)
    }
  }

  async clearMemory(businessId: string, waId: string): Promise<void> {
    try {
      // In a real implementation, this would clear from database
      console.log(`Clearing memory for ${businessId}:${waId}`)
    } catch (error) {
      console.error('Error clearing memory:', error)
    }
  }

  // Helper method to format messages for AI service
  formatMessagesForAI(messages: ChatMessage[]): ChatMessage[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  }

  // Helper method to create a new conversation context
  createNewContext(): ChatMessage[] {
    return []
  }

  // Helper method to add system message
  addSystemMessage(messages: ChatMessage[], systemContent: string): ChatMessage[] {
    return [
      { role: 'system', content: systemContent },
      ...messages
    ]
  }
}






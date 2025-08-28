export type LogLevel = 'INFO' | 'WARN' | 'ERROR'

export interface LogEntry {
  businessId: string
  waId?: string
  level: LogLevel
  message: string
  meta?: Record<string, any>
  timestamp: Date
}

export class LogService {
  private logs: LogEntry[] = []
  private maxLogs = 1000 // Keep last 1000 logs in memory

  async log(entry: Omit<LogEntry, 'timestamp'>): Promise<void> {
    try {
      const logEntry: LogEntry = {
        ...entry,
        timestamp: new Date()
      }

      // Add to memory
      this.logs.push(logEntry)
      
      // Keep only last maxLogs
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs)
      }

      // In a real implementation, this would save to database
      console.log(`[${entry.level}] ${entry.businessId}:${entry.waId || 'SYSTEM'} - ${entry.message}`, entry.meta)

      // Emit to WebSocket if available
      this.emitToWebSocket(logEntry)
    } catch (error) {
      console.error('Error logging:', error)
    }
  }

  async info(businessId: string, message: string, meta?: Record<string, any>, waId?: string): Promise<void> {
    await this.log({ businessId, waId, level: 'INFO', message, meta })
  }

  async warn(businessId: string, message: string, meta?: Record<string, any>, waId?: string): Promise<void> {
    await this.log({ businessId, waId, level: 'WARN', message, meta })
  }

  async error(businessId: string, message: string, meta?: Record<string, any>, waId?: string): Promise<void> {
    await this.log({ businessId, waId, level: 'ERROR', message, meta })
  }

  async getLogs(businessId: string, limit: number = 100): Promise<LogEntry[]> {
    try {
      // In a real implementation, this would fetch from database
      return this.logs
        .filter(log => log.businessId === businessId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting logs:', error)
      return []
    }
  }

  async getLogsByLevel(businessId: string, level: LogLevel, limit: number = 100): Promise<LogEntry[]> {
    try {
      return this.logs
        .filter(log => log.businessId === businessId && log.level === level)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting logs by level:', error)
      return []
    }
  }

  async clearLogs(businessId: string): Promise<void> {
    try {
      this.logs = this.logs.filter(log => log.businessId !== businessId)
      console.log(`Cleared logs for business: ${businessId}`)
    } catch (error) {
      console.error('Error clearing logs:', error)
    }
  }

  // WebSocket emission (placeholder for now)
  private emitToWebSocket(logEntry: LogEntry): void {
    // In a real implementation, this would emit to WebSocket
    // For now, just a placeholder
    if (typeof window !== 'undefined') {
      // Client-side: could emit to WebSocket
      console.log('WebSocket emit:', logEntry)
    }
  }

  // Get logs for dashboard
  getDashboardLogs(businessId: string): LogEntry[] {
    return this.logs
      .filter(log => log.businessId === businessId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 50) // Last 50 logs for dashboard
  }

  // Get log statistics
  getLogStats(businessId: string): {
    total: number
    info: number
    warn: number
    error: number
  } {
    const businessLogs = this.logs.filter(log => log.businessId === businessId)
    
    return {
      total: businessLogs.length,
      info: businessLogs.filter(log => log.level === 'INFO').length,
      warn: businessLogs.filter(log => log.level === 'WARN').length,
      error: businessLogs.filter(log => log.level === 'ERROR').length,
    }
  }
}






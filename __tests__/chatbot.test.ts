import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// Mock all modules that might access file system
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(),
  statSync: jest.fn(),
}))

jest.mock('path', () => ({
  join: jest.fn(),
  resolve: jest.fn(),
  dirname: jest.fn(),
  extname: jest.fn(),
  basename: jest.fn(),
}))

jest.mock('crypto', () => ({
  createHmac: jest.fn(() => ({
    update: jest.fn(() => ({
      digest: jest.fn(() => 'mocked-hash')
    }))
  }))
}))

// Mock fetch globally
global.fetch = jest.fn()

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}

// Only import after mocks are set up
import { WhatsAppService } from '../lib/services/WhatsAppService'
import { AIService } from '../lib/services/AIService'
import { MemoryService } from '../lib/services/MemoryService'
import { PDFService } from '../lib/services/PDFService'
import { LogService } from '../lib/services/LogService'
import { encryptSecret, decryptSecret, verifyMetaSignature } from '../lib/crypto'

describe('Chatbot Services', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Crypto Service', () => {
    it('should encrypt and decrypt secrets correctly', () => {
      const originalText = 'test-secret-123'
      const encrypted = encryptSecret(originalText)
      const decrypted = decryptSecret(encrypted)
      
      expect(encrypted).not.toBe(originalText)
      expect(decrypted).toBe(originalText)
    })

    it('should verify Meta signature correctly', () => {
      const appSecret = 'test-app-secret'
      const body = Buffer.from('test-body')
      const signature = 'sha256=' + require('crypto').createHmac('sha256', appSecret).update(body).digest('hex')
      
      const isValid = verifyMetaSignature(appSecret, body, signature)
      expect(isValid).toBe(true)
    })

    it('should reject invalid signatures', () => {
      const appSecret = 'test-app-secret'
      const body = Buffer.from('test-body')
      const invalidSignature = 'sha256=invalid-signature'
      
      const isValid = verifyMetaSignature(appSecret, body, invalidSignature)
      expect(isValid).toBe(false)
    })
  })

  describe('WhatsApp Service', () => {
    const mockConfig = {
      phoneNumberId: 'test-phone-id',
      wabaId: 'test-waba-id',
      accessTokenEnc: encryptSecret('test-access-token'),
      verifyTokenEnc: encryptSecret('test-verify-token'),
      graphVersion: 'v21.0',
      mode: 'sandbox'
    }

    it('should initialize with encrypted config', () => {
      const service = new WhatsAppService(mockConfig)
      expect(service).toBeDefined()
    })

    it('should send text message', async () => {
      const mockResponse = { id: 'test-message-id' }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const service = new WhatsAppService(mockConfig)
      const result = await service.sendText('1234567890', 'Test message')
      
      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        'https://graph.facebook.com/v21.0/test-phone-id/messages',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Test message')
        })
      )
    })

    it('should handle WhatsApp API errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      })

      const service = new WhatsAppService(mockConfig)
      
      await expect(service.sendText('1234567890', 'Test message'))
        .rejects
        .toThrow('WhatsApp API error: 400 Bad Request')
    })
  })

  describe('AI Service', () => {
    const mockApiKey = 'test-openai-key'

    it('should initialize with API key', () => {
      const service = new AIService(mockApiKey)
      expect(service).toBeDefined()
    })

    it('should generate chat response', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Test AI response' } }]
      }
      
      // Mock OpenAI client
      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockResponse)
          }
        }
      }
      
      jest.doMock('openai', () => ({
        __esModule: true,
        default: jest.fn().mockImplementation(() => mockOpenAI)
      }))

      const service = new AIService(mockApiKey)
      const result = await service.chat({
        businessId: 'test-business',
        text: 'Test user message',
        memory: []
      })
      
      expect(result).toBe('Test AI response')
    })

    it('should compose prompts for different media types', () => {
      const service = new AIService()
      
      const textPrompt = service.composePrompt('text', 'Hello')
      const audioPrompt = service.composePrompt('audio', 'Hello', 'Context')
      const imagePrompt = service.composePrompt('image', 'A cat', 'Context')
      const pdfPrompt = service.composePrompt('pdf', 'Document content', 'Context')
      
      expect(textPrompt).toBe('Hello')
      expect(audioPrompt).toContain('mensaje de voz')
      expect(imagePrompt).toContain('imagen')
      expect(pdfPrompt).toContain('documento PDF')
    })
  })

  describe('Memory Service', () => {
    const service = new MemoryService()

    it('should create new context', () => {
      const context = service.createNewContext()
      expect(context).toEqual([])
    })

    it('should add system message', () => {
      const messages = [{ role: 'user', content: 'Hello' }]
      const systemMessage = 'You are a helpful assistant'
      const result = service.addSystemMessage(messages, systemMessage)
      
      expect(result[0]).toEqual({ role: 'system', content: systemMessage })
      expect(result[1]).toEqual(messages[0])
    })

    it('should format messages for AI', () => {
      const messages = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' }
      ]
      
      const formatted = service.formatMessagesForAI(messages)
      expect(formatted).toEqual(messages)
    })
  })

  describe('PDF Service', () => {
    const service = new PDFService()

    it('should validate PDF buffer', () => {
      const validPDF = Buffer.from('%PDF-1.4\n%Test content')
      const invalidPDF = Buffer.from('Not a PDF')
      
      expect(service.isValidPDF(validPDF)).toBe(true)
      expect(service.isValidPDF(invalidPDF)).toBe(false)
    })

    it('should get PDF info', () => {
      const pdfBuffer = Buffer.from('%PDF-1.4\n%Test content')
      const info = service.getPDFInfo(pdfBuffer)
      
      expect(info.size).toBe(pdfBuffer.length)
      expect(info.isValid).toBe(true)
    })
  })

  describe('Log Service', () => {
    const service = new LogService()

    it('should log messages', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      await service.info('test-business', 'Test log message')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[INFO] test-business:SYSTEM - Test log message',
        undefined
      )
      
      consoleSpy.mockRestore()
    })

    it('should get log statistics', () => {
      const stats = service.getLogStats('test-business')
      
      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('info')
      expect(stats).toHaveProperty('warn')
      expect(stats).toHaveProperty('error')
    })

    it('should clear logs for business', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      
      await service.clearLogs('test-business')
      
      expect(consoleSpy).toHaveBeenCalledWith('Cleared logs for business: test-business')
      
      consoleSpy.mockRestore()
    })
  })
})


import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FlowRunner } from '../FlowRunner'
import { FlowConfig, FlowContext, FlowCallbacks } from '../types'

// Mock services
const mockLLMService = {
  call: vi.fn(),
  stream: vi.fn()
}

const mockWhatsAppService = {
  sendMessage: vi.fn(),
  sendTemplate: vi.fn()
}

const mockDatasourceService = {
  query: vi.fn()
}

describe('FlowRunner', () => {
  let flowRunner: FlowRunner
  let mockCallbacks: FlowCallbacks

  beforeEach(() => {
    flowRunner = new FlowRunner({
      llmService: mockLLMService as any,
      whatsappService: mockWhatsAppService as any,
      datasourceService: mockDatasourceService as any
    })

    mockCallbacks = {
      onToken: vi.fn(),
      onStep: vi.fn(),
      onMeta: vi.fn()
    }

    vi.clearAllMocks()
  })

  describe('runFlow', () => {
    it('should execute a simple flow with basic steps', async () => {
      const config: FlowConfig = {
        id: 'test-flow',
        name: 'Test Flow',
        steps: [
          {
            id: 'step1',
            type: 'message',
            content: 'Hello, how can I help you?'
          },
          {
            id: 'step2',
            type: 'input',
            prompt: 'Please provide your question'
          }
        ]
      }

      const context: FlowContext = {
        userId: 'user123',
        userEmail: 'test@example.com',
        workspaceId: 'ws123',
        input: 'I need help',
        attachments: []
      }

      const result = await flowRunner.runFlow(config, context, mockCallbacks)

      expect(result.success).toBe(true)
      expect(result.stepsExecuted).toHaveLength(2)
      expect(mockCallbacks.onStep).toHaveBeenCalledWith('step1')
      expect(mockCallbacks.onStep).toHaveBeenCalledWith('step2')
    })

    it('should handle LLM processing steps', async () => {
      const config: FlowConfig = {
        id: 'test-flow',
        name: 'Test Flow',
        steps: [
          {
            id: 'llm-step',
            type: 'llm',
            prompt: 'Process this: {{input}}',
            model: 'gpt-4'
          }
        ]
      }

      const context: FlowContext = {
        userId: 'user123',
        userEmail: 'test@example.com',
        workspaceId: 'ws123',
        input: 'Hello world',
        attachments: []
      }

      mockLLMService.call.mockResolvedValue({
        content: 'Processed: Hello world',
        tokens: { input: 10, output: 15, total: 25 }
      })

      const result = await flowRunner.runFlow(config, context, mockCallbacks)

      expect(result.success).toBe(true)
      expect(mockLLMService.call).toHaveBeenCalledWith({
        prompt: 'Process this: Hello world',
        model: 'gpt-4'
      })
      expect(mockCallbacks.onMeta).toHaveBeenCalledWith({
        tokens: { input: 10, output: 15, total: 25 }
      })
    })

    it('should handle datasource query steps', async () => {
      const config: FlowConfig = {
        id: 'test-flow',
        name: 'Test Flow',
        steps: [
          {
            id: 'query-step',
            type: 'datasource-query',
            datasourceId: 'ds123',
            query: 'Find products matching {{input}}'
          }
        ]
      }

      const context: FlowContext = {
        userId: 'user123',
        userEmail: 'test@example.com',
        workspaceId: 'ws123',
        input: 'electronics',
        attachments: []
      }

      mockDatasourceService.query.mockResolvedValue([
        { id: 1, name: 'Laptop', category: 'electronics' },
        { id: 2, name: 'Phone', category: 'electronics' }
      ])

      const result = await flowRunner.runFlow(config, context, mockCallbacks)

      expect(result.success).toBe(true)
      expect(mockDatasourceService.query).toHaveBeenCalledWith({
        datasourceId: 'ds123',
        query: 'Find products matching electronics'
      })
    })

    it('should handle WhatsApp message steps', async () => {
      const config: FlowConfig = {
        id: 'test-flow',
        name: 'Test Flow',
        steps: [
          {
            id: 'whatsapp-step',
            type: 'whatsapp',
            action: 'send',
            message: 'Thank you for your message: {{input}}'
          }
        ]
      }

      const context: FlowContext = {
        userId: 'user123',
        userEmail: 'test@example.com',
        workspaceId: 'ws123',
        input: 'Hello',
        attachments: []
      }

      mockWhatsAppService.sendMessage.mockResolvedValue({
        messageId: 'msg123',
        status: 'sent'
      })

      const result = await flowRunner.runFlow(config, context, mockCallbacks)

      expect(result.success).toBe(true)
      expect(mockWhatsAppService.sendMessage).toHaveBeenCalledWith({
        message: 'Thank you for your message: Hello'
      })
    })

    it('should handle errors gracefully', async () => {
      const config: FlowConfig = {
        id: 'test-flow',
        name: 'Test Flow',
        steps: [
          {
            id: 'error-step',
            type: 'llm',
            prompt: 'This will fail',
            model: 'gpt-4'
          }
        ]
      }

      const context: FlowContext = {
        userId: 'user123',
        userEmail: 'test@example.com',
        workspaceId: 'ws123',
        input: 'test',
        attachments: []
      }

      mockLLMService.call.mockRejectedValue(new Error('LLM service error'))

      const result = await flowRunner.runFlow(config, context, mockCallbacks)

      expect(result.success).toBe(false)
      expect(result.error).toBe('LLM service error')
      expect(result.stepsExecuted).toHaveLength(1)
    })

    it('should support conditional steps', async () => {
      const config: FlowConfig = {
        id: 'test-flow',
        name: 'Test Flow',
        steps: [
          {
            id: 'conditional-step',
            type: 'conditional',
            condition: '{{input.length > 5}}',
            ifTrue: [
              {
                id: 'long-input',
                type: 'message',
                content: 'Your message is long'
              }
            ],
            ifFalse: [
              {
                id: 'short-input',
                type: 'message',
                content: 'Your message is short'
              }
            ]
          }
        ]
      }

      const context: FlowContext = {
        userId: 'user123',
        userEmail: 'test@example.com',
        workspaceId: 'ws123',
        input: 'This is a long message',
        attachments: []
      }

      const result = await flowRunner.runFlow(config, context, mockCallbacks)

      expect(result.success).toBe(true)
      expect(result.stepsExecuted).toContain('long-input')
      expect(result.stepsExecuted).not.toContain('short-input')
    })
  })

  describe('step execution', () => {
    it('should execute steps in order', async () => {
      const config: FlowConfig = {
        id: 'test-flow',
        name: 'Test Flow',
        steps: [
          { id: 'step1', type: 'message', content: 'First' },
          { id: 'step2', type: 'message', content: 'Second' },
          { id: 'step3', type: 'message', content: 'Third' }
        ]
      }

      const context: FlowContext = {
        userId: 'user123',
        userEmail: 'test@example.com',
        workspaceId: 'ws123',
        input: 'test',
        attachments: []
      }

      const result = await flowRunner.runFlow(config, context, mockCallbacks)

      expect(result.stepsExecuted).toEqual(['step1', 'step2', 'step3'])
    })

    it('should stop execution on error', async () => {
      const config: FlowConfig = {
        id: 'test-flow',
        name: 'Test Flow',
        steps: [
          { id: 'step1', type: 'message', content: 'First' },
          { id: 'step2', type: 'llm', prompt: 'This will fail', model: 'gpt-4' },
          { id: 'step3', type: 'message', content: 'This should not execute' }
        ]
      }

      const context: FlowContext = {
        userId: 'user123',
        userEmail: 'test@example.com',
        workspaceId: 'ws123',
        input: 'test',
        attachments: []
      }

      mockLLMService.call.mockRejectedValue(new Error('LLM error'))

      const result = await flowRunner.runFlow(config, context, mockCallbacks)

      expect(result.success).toBe(false)
      expect(result.stepsExecuted).toEqual(['step1', 'step2'])
      expect(result.stepsExecuted).not.toContain('step3')
    })
  })
})

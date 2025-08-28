export interface LLMProvider {
  chat(
    messages: Array<{role: 'system' | 'user' | 'assistant'; content: string}>,
    opts?: { model?: string; temperature?: number }
  ): Promise<string>
  
  test(): Promise<boolean>
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

// OpenAI Provider
export class OpenAIProvider implements LLMProvider {
  private apiKey: string
  private baseUrl: string
  private defaultModel: string

  constructor(apiKey: string, baseUrl?: string, defaultModel?: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl || 'https://api.openai.com/v1'
    this.defaultModel = defaultModel || 'gpt-4o-mini'
  }

  async chat(messages: LLMMessage[], opts?: LLMOptions): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: opts?.model || this.defaultModel,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: opts?.temperature || 0.7,
          max_tokens: opts?.maxTokens || 1000
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'No response from OpenAI'
    } catch (error) {
      console.error('OpenAI chat error:', error)
      throw new Error(`OpenAI chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async test(): Promise<boolean> {
    try {
      const response = await this.chat([
        { role: 'user', content: 'Respondé OK' }
      ])
      return response.toLowerCase().includes('ok')
    } catch (error) {
      console.error('OpenAI test failed:', error)
      return false
    }
  }
}

// Gemini Provider
export class GeminiProvider implements LLMProvider {
  private apiKey: string
  private defaultModel: string

  constructor(apiKey: string, defaultModel?: string) {
    this.apiKey = apiKey
    this.defaultModel = defaultModel || 'gemini-1.5-flash'
  }

  async chat(messages: LLMMessage[], opts?: LLMOptions): Promise<string> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${opts?.model || this.defaultModel}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            temperature: opts?.temperature || 0.7,
            maxOutputTokens: opts?.maxTokens || 1000
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data.candidates[0]?.content?.parts[0]?.text || 'No response from Gemini'
    } catch (error) {
      console.error('Gemini chat error:', error)
      throw new Error(`Gemini chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async test(): Promise<boolean> {
    try {
      const response = await this.chat([
        { role: 'user', content: 'Respondé OK' }
      ])
      return response.toLowerCase().includes('ok')
    } catch (error) {
      console.error('Gemini test failed:', error)
      return false
    }
  }
}

// Anthropic Provider
export class AnthropicProvider implements LLMProvider {
  private apiKey: string
  private defaultModel: string

  constructor(apiKey: string, defaultModel?: string) {
    this.apiKey = apiKey
    this.defaultModel = defaultModel || 'claude-3-haiku'
  }

  async chat(messages: LLMMessage[], opts?: LLMOptions): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: opts?.model || this.defaultModel,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          max_tokens: opts?.maxTokens || 1000
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data.content[0]?.text || 'No response from Anthropic'
    } catch (error) {
      console.error('Anthropic chat error:', error)
      throw new Error(`Anthropic chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async test(): Promise<boolean> {
    try {
      const response = await this.chat([
        { role: 'user', content: 'Respondé OK' }
      ])
      return response.toLowerCase().includes('ok')
    } catch (error) {
      console.error('Anthropic test failed:', error)
      return false
    }
  }
}

// Factory para crear proveedores
export class LLMProviderFactory {
  static create(type: 'OPENAI' | 'GEMINI' | 'ANTHROPIC', apiKey: string, options?: any): LLMProvider {
    switch (type) {
      case 'OPENAI':
        return new OpenAIProvider(apiKey, options?.baseUrl, options?.defaultModel)
      case 'GEMINI':
        return new GeminiProvider(apiKey, options?.defaultModel)
      case 'ANTHROPIC':
        return new AnthropicProvider(apiKey, options?.defaultModel)
      default:
        throw new Error(`Unsupported LLM provider type: ${type}`)
    }
  }
}


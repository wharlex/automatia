import { decryptSecret } from '@/lib/crypto'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface KnowledgeContext {
  query: string
  relevantDocs: Array<{
    title: string
    content: string
    category: string
    relevance: number
  }>
}

export class AIService {
  private apiKey: string
  private baseUrl = 'https://api.openai.com/v1'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || ''
  }

  async chat(messages: ChatMessage[], knowledgeContext?: KnowledgeContext): Promise<string> {
    try {
      // Enhance system message with knowledge context if available
      let enhancedMessages = [...messages]
      
      if (knowledgeContext && knowledgeContext.relevantDocs.length > 0) {
        const knowledgePrompt = this.createKnowledgePrompt(knowledgeContext)
        enhancedMessages[0] = {
          role: 'system',
          content: `${enhancedMessages[0].content}\n\n${knowledgePrompt}`
        }
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: enhancedMessages,
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error in AI chat:', error)
      throw new Error('Failed to get AI response')
    }
  }

  async visionDescribe(imageUrl: string, prompt?: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt || 'Describe what you see in this image in detail.'
                },
                {
                  type: 'image_url',
                  image_url: { url: imageUrl }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error in vision describe:', error)
      throw new Error('Failed to analyze image')
    }
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      const formData = new FormData()
      const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' })
      formData.append('file', audioBlob, 'audio.webm')
      formData.append('model', 'whisper-1')

      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.text
    } catch (error) {
      console.error('Error in audio transcription:', error)
      throw new Error('Failed to transcribe audio')
    }
  }

  async tts(text: string, voice: string = 'alloy'): Promise<Buffer> {
    try {
      const response = await fetch(`${this.baseUrl}/audio/speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch (error) {
      console.error('Error in TTS:', error)
      throw new Error('Failed to generate speech')
    }
  }

  composePrompt(businessInfo: any, userMessage: string): string {
    return `Eres un asistente virtual profesional para ${businessInfo.name || 'un negocio'}.
    
Información del negocio:
- Industria: ${businessInfo.industry || 'No especificada'}
- Descripción: ${businessInfo.description || 'No especificada'}
- Horarios: ${businessInfo.hours || 'No especificados'}
- Contacto: ${businessInfo.phone || 'No especificado'}

Instrucciones:
1. Responde de manera clara, útil y profesional
2. Usa la información del negocio cuando sea relevante
3. Si no tienes información específica, sugiere contactar al negocio
4. Mantén un tono amigable pero profesional
5. Sé conciso pero completo

Mensaje del usuario: ${userMessage}`
  }

  private createKnowledgePrompt(knowledgeContext: KnowledgeContext): string {
    const docs = knowledgeContext.relevantDocs
      .map(doc => `- ${doc.title} (${doc.category}): ${doc.content.substring(0, 200)}...`)
      .join('\n')

    return `INFORMACIÓN RELEVANTE DE LA BASE DE CONOCIMIENTO:
Consulta: "${knowledgeContext.query}"

Documentos relevantes:
${docs}

Usa esta información para proporcionar respuestas más precisas y útiles. Si la información no es suficiente, indícalo claramente.`
  }

  async searchKnowledge(query: string): Promise<KnowledgeContext> {
    try {
      const response = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 3 })
      })

      if (!response.ok) {
        throw new Error('Failed to search knowledge base')
      }

      const data = await response.json()
      
      return {
        query,
        relevantDocs: data.results.map((item: any) => ({
          title: item.name,
          content: item.extractedText || item.description,
          category: item.category,
          relevance: item.searchScore || 0
        }))
      }
    } catch (error) {
      console.error('Error searching knowledge base:', error)
      return {
        query,
        relevantDocs: []
      }
    }
  }
}



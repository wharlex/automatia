import { adminDb } from "./firebaseAdmin"
import { decrypt } from "./secretsServer"

export type ChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

export type LLMConfig = {
  provider: "openai" | "gemini"
  model?: string
  temperature?: number
  topP?: number
  maxTokens?: number
  contextWindow?: number
  systemPrompt?: string
  safetyFilters?: {
    spam: boolean
    inappropriate: boolean
    sentiment: boolean
  }
}

export async function* streamLLM(userId: string, messages: ChatMessage[]): AsyncGenerator<string> {
  const [secretDoc, configDoc] = await Promise.all([
    adminDb.collection("secrets").doc(`${userId}_llm`).get(),
    adminDb.collection("llm_config").doc(userId).get(),
  ])

  if (!secretDoc.exists) {
    throw new Error("LLM not configured")
  }

  const secretData = secretDoc.data()
  const config = configDoc.exists ? configDoc.data() : {}

  const apiKey = decrypt(secretData.encValue)
  const provider = secretData.provider
  const model = secretData.model || getDefaultModel(provider)

  // Apply safety filters
  const filteredMessages = await applySafetyFilters(messages, config.safetyFilters || {})

  // Apply context window limit
  const contextWindow = config.contextWindow || 10
  const limitedMessages = limitContextWindow(filteredMessages, contextWindow)

  // Log conversation start
  const conversationId = await logConversationStart(userId, limitedMessages, provider, model)

  try {
    let fullResponse = ""

    if (provider === "openai") {
      for await (const chunk of streamOpenAI(apiKey, limitedMessages, model, config)) {
        fullResponse += chunk
        yield chunk
      }
    } else if (provider === "gemini") {
      for await (const chunk of streamGemini(apiKey, limitedMessages, model, config)) {
        fullResponse += chunk
        yield chunk
      }
    } else {
      throw new Error("Unsupported LLM provider")
    }

    // Apply output safety filters
    const safeResponse = await filterResponse(fullResponse, config.safetyFilters || {})

    // Log successful completion
    await logConversationEnd(conversationId, safeResponse, "completed")
  } catch (error) {
    // Log error
    await logConversationEnd(conversationId, "", "error", error.message)
    throw error
  }
}

async function* streamOpenAI(
  apiKey: string,
  messages: ChatMessage[],
  model = "gpt-4o-mini",
  config: any = {},
): AsyncGenerator<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: config.temperature || 0.7,
      top_p: config.topP || 0.9,
      max_tokens: config.maxTokens || 2048,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`OpenAI API error: ${response.statusText} - ${errorData.error?.message || "Unknown error"}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) return

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter((line) => line.trim() !== "")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") return

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              yield content
            }
          } catch (e) {
            console.warn("[v0] Invalid JSON in OpenAI stream:", data)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

async function* streamGemini(
  apiKey: string,
  messages: ChatMessage[],
  model = "gemini-1.5-flash",
  config: any = {},
): AsyncGenerator<string> {
  const formattedMessages = messages.filter((m) => m.role !== "system")
  const systemMessage = messages.find((m) => m.role === "system")

  const contents = formattedMessages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }))

  const requestBody = {
    contents,
    systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
    generationConfig: {
      temperature: config.temperature || 0.7,
      topP: config.topP || 0.9,
      maxOutputTokens: config.maxTokens || 2048,
    },
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Gemini API error: ${response.statusText} - ${errorData.error?.message || "Unknown error"}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) return

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter((line) => line.trim() !== "")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          try {
            const parsed = JSON.parse(data)
            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text
            if (content) {
              yield content
            }
          } catch (e) {
            console.warn("[v0] Invalid JSON in Gemini stream:", data)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export async function testLLMConnection(
  provider: string,
  apiKey: string,
  model?: string,
): Promise<{ success: boolean; error?: string; availableModels?: string[] }> {
  try {
    if (provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { success: false, error: errorData.error?.message || "Invalid API key" }
      }

      const data = await response.json()
      const availableModels =
        data.data?.map((m: any) => m.id).filter((id: string) => id.includes("gpt-4") || id.includes("gpt-3.5")) || []

      return { success: true, availableModels }
    } else if (provider === "gemini") {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { success: false, error: errorData.error?.message || "Invalid API key" }
      }

      const data = await response.json()
      const availableModels =
        data.models?.map((m: any) => m.name.split("/").pop()).filter((name: string) => name.includes("gemini")) || []

      return { success: true, availableModels }
    }

    return { success: false, error: "Unsupported provider" }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

function getDefaultModel(provider: string): string {
  switch (provider) {
    case "openai":
      return "gpt-4o-mini"
    case "gemini":
      return "gemini-1.5-flash"
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

async function logConversationStart(
  userId: string,
  messages: ChatMessage[],
  provider: string,
  model: string,
): Promise<string> {
  try {
    const conversationDoc = {
      userId,
      provider,
      model,
      messageCount: messages.length,
      startedAt: new Date(),
      status: "in_progress",
    }

    const docRef = await adminDb.collection("conversation_logs").add(conversationDoc)
    return docRef.id
  } catch (error) {
    console.error("[v0] Failed to log conversation start:", error)
    return "unknown"
  }
}

async function logConversationEnd(
  conversationId: string,
  response: string,
  status: "completed" | "error",
  errorMessage?: string,
): Promise<void> {
  try {
    if (conversationId === "unknown") return

    await adminDb
      .collection("conversation_logs")
      .doc(conversationId)
      .update({
        status,
        responseLength: response.length,
        completedAt: new Date(),
        errorMessage: errorMessage || null,
      })
  } catch (error) {
    console.error("[v0] Failed to log conversation end:", error)
  }
}

export async function getAvailableModels(userId: string): Promise<{ models: string[]; currentModel?: string }> {
  try {
    const secretDoc = await adminDb.collection("secrets").doc(`${userId}_llm`).get()

    if (!secretDoc.exists) {
      return { models: [] }
    }

    const secretData = secretDoc.data()
    const provider = secretData.provider
    const currentModel = secretData.model || getDefaultModel(provider)

    // Return common models for each provider
    const modelMap = {
      openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
      gemini: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"],
    }

    return {
      models: modelMap[provider] || [],
      currentModel,
    }
  } catch (error) {
    console.error("[v0] Failed to get available models:", error)
    return { models: [] }
  }
}

async function applySafetyFilters(messages: ChatMessage[], filters: any): Promise<ChatMessage[]> {
  if (!filters.spam && !filters.inappropriate && !filters.sentiment) {
    return messages
  }

  return messages.map((message) => {
    let content = message.content

    if (filters.spam) {
      // Basic spam detection
      const spamPatterns = /\b(viagra|casino|lottery|winner|congratulations|click here|free money)\b/gi
      if (spamPatterns.test(content)) {
        console.log("[v0] Spam detected in message, filtering...")
        content = "[Mensaje filtrado por spam]"
      }
    }

    if (filters.inappropriate) {
      // Basic inappropriate content detection
      const inappropriatePatterns = /\b(fuck|shit|damn|hell|bitch)\b/gi
      content = content.replace(inappropriatePatterns, "***")
    }

    return { ...message, content }
  })
}

async function filterResponse(response: string, filters: any): Promise<string> {
  if (!filters.spam && !filters.inappropriate) {
    return response
  }

  let filteredResponse = response

  if (filters.inappropriate) {
    // Clean up inappropriate content in responses
    const inappropriatePatterns = /\b(fuck|shit|damn|hell|bitch)\b/gi
    filteredResponse = filteredResponse.replace(inappropriatePatterns, "***")
  }

  return filteredResponse
}

function limitContextWindow(messages: ChatMessage[], contextWindow: number): ChatMessage[] {
  if (messages.length <= contextWindow) {
    return messages
  }

  // Keep system message and last N messages
  const systemMessages = messages.filter((m) => m.role === "system")
  const otherMessages = messages.filter((m) => m.role !== "system")
  const recentMessages = otherMessages.slice(-contextWindow)

  return [...systemMessages, ...recentMessages]
}

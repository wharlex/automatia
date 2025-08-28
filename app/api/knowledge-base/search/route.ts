import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"
import { decrypt } from "@/lib/secretsServer"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { query, topK = 3 } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Query es requerido" }, { status: 400 })
    }

    const searchResults = await searchKnowledgeBase(user.uid, query, topK)

    return NextResponse.json(searchResults)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function searchKnowledgeBase(userId: string, query: string, topK: number) {
  try {
    // Get LLM configuration for query embedding
    const secretDoc = await adminDb.collection("secrets").doc(`${userId}_llm`).get()

    if (!secretDoc.exists) {
      return { found: false, error: "LLM no configurado" }
    }

    const secretData = secretDoc.data()
    const apiKey = decrypt(secretData.encValue)
    const provider = secretData.provider

    // Generate query embedding
    const queryEmbedding = await generateQueryEmbedding(query, provider, apiKey)

    // Search for similar chunks
    const knowledgeBaseQuery = await adminDb.collection("knowledge_base").where("userId", "==", userId).get()

    if (knowledgeBaseQuery.empty) {
      return { found: false, message: "Base de conocimiento vacía" }
    }

    // Calculate similarities and get top-k results
    const results = []

    knowledgeBaseQuery.docs.forEach((doc) => {
      const data = doc.data()
      const similarity = cosineSimilarity(queryEmbedding, data.embedding)

      results.push({
        content: data.content,
        source: data.source,
        metadata: data.metadata,
        similarity,
      })
    })

    // Sort by similarity and take top-k
    results.sort((a, b) => b.similarity - a.similarity)
    const topResults = results.slice(0, topK)

    // Filter results with minimum similarity threshold
    const relevantResults = topResults.filter((result) => result.similarity > 0.7)

    if (relevantResults.length === 0) {
      return { found: false, message: "No se encontró información relevante" }
    }

    // Combine results into context
    const context = relevantResults.map((result) => result.content).join("\n\n")

    return {
      found: true,
      context,
      results: relevantResults,
      sources: [...new Set(relevantResults.map((r) => r.source))],
    }
  } catch (error) {
    console.error("[v0] Knowledge base search error:", error)
    return { found: false, error: error.message }
  }
}

async function generateQueryEmbedding(query: string, provider: string, apiKey: string): Promise<number[]> {
  if (provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI embeddings error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data[0].embedding
  } else if (provider === "gemini") {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "models/embedding-001",
          content: {
            parts: [{ text: query }],
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini embeddings error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.embedding.values
  }

  throw new Error("Unsupported provider for embeddings")
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

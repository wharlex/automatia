import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"
import { decrypt } from "@/lib/secretsServer"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { companyInfo, faqData, files } = await req.json()

    const processingResult = await processKnowledgeBase(user.uid, {
      companyInfo: companyInfo || "",
      faqData: faqData || "",
      files: files || [],
    })

    return NextResponse.json(processingResult)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function processKnowledgeBase(userId: string, data: any) {
  try {
    // Get LLM configuration for embeddings
    const secretDoc = await adminDb.collection("secrets").doc(`${userId}_llm`).get()

    if (!secretDoc.exists) {
      throw new Error("LLM no configurado - necesario para generar embeddings")
    }

    const secretData = secretDoc.data()
    const apiKey = decrypt(secretData.encValue)
    const provider = secretData.provider

    let totalChunks = 0
    let totalDocuments = 0

    // Process company info
    if (data.companyInfo) {
      const chunks = chunkText(data.companyInfo, "company_info")
      const embeddings = await generateEmbeddings(chunks, provider, apiKey)
      await storeEmbeddings(userId, "company_info", chunks, embeddings)
      totalChunks += chunks.length
      totalDocuments += 1
    }

    // Process FAQ data
    if (data.faqData) {
      const faqChunks = processFAQData(data.faqData)
      const embeddings = await generateEmbeddings(faqChunks, provider, apiKey)
      await storeEmbeddings(userId, "faq", faqChunks, embeddings)
      totalChunks += faqChunks.length
      totalDocuments += 1
    }

    // Process uploaded files (placeholder - in production would handle actual file uploads)
    for (const file of data.files) {
      const fileChunks = await processFile(file)
      const embeddings = await generateEmbeddings(fileChunks, provider, apiKey)
      await storeEmbeddings(userId, `file_${file.name}`, fileChunks, embeddings)
      totalChunks += fileChunks.length
      totalDocuments += 1
    }

    // Update knowledge base status
    await adminDb.collection("knowledge_base_status").doc(userId).set({
      configured: true,
      totalDocuments,
      totalChunks,
      lastProcessed: new Date(),
      provider,
    })

    return {
      success: true,
      message: `Procesamiento completado: ${totalDocuments} documentos, ${totalChunks} chunks indexados`,
      totalDocuments,
      totalChunks,
    }
  } catch (error) {
    console.error("[v0] Knowledge base processing error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

function chunkText(text: string, source: string): Array<{ content: string; source: string; metadata: any }> {
  // Simple chunking strategy - split by sentences and group
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const chunks = []
  const chunkSize = 3 // sentences per chunk

  for (let i = 0; i < sentences.length; i += chunkSize) {
    const chunkSentences = sentences.slice(i, i + chunkSize)
    const content = chunkSentences.join(". ").trim() + "."

    if (content.length > 50) {
      // Only include meaningful chunks
      chunks.push({
        content,
        source,
        metadata: {
          chunkIndex: Math.floor(i / chunkSize),
          sentenceCount: chunkSentences.length,
        },
      })
    }
  }

  return chunks
}

function processFAQData(faqText: string): Array<{ content: string; source: string; metadata: any }> {
  const chunks = []
  const faqPairs = faqText.split(/\n\s*\n/).filter((pair) => pair.trim())

  faqPairs.forEach((pair, index) => {
    const lines = pair.split("\n").filter((line) => line.trim())
    if (lines.length >= 2) {
      const question = lines[0].replace(/^Pregunta:\s*/i, "").trim()
      const answer = lines
        .slice(1)
        .join(" ")
        .replace(/^Respuesta:\s*/i, "")
        .trim()

      chunks.push({
        content: `Pregunta: ${question}\nRespuesta: ${answer}`,
        source: "faq",
        metadata: {
          question,
          answer,
          faqIndex: index,
        },
      })
    }
  })

  return chunks
}

async function processFile(file: any): Promise<Array<{ content: string; source: string; metadata: any }>> {
  // Placeholder for file processing - in production would handle PDF/DOCX parsing
  // For now, assume file.content contains the text content
  const content = file.content || `Contenido del archivo ${file.name}`
  return chunkText(content, `file_${file.name}`)
}

async function generateEmbeddings(chunks: any[], provider: string, apiKey: string): Promise<number[][]> {
  const embeddings = []

  for (const chunk of chunks) {
    try {
      let embedding

      if (provider === "openai") {
        const response = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: chunk.content,
          }),
        })

        if (!response.ok) {
          throw new Error(`OpenAI embeddings error: ${response.statusText}`)
        }

        const data = await response.json()
        embedding = data.data[0].embedding
      } else if (provider === "gemini") {
        // Use Gemini embedding API
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
                parts: [{ text: chunk.content }],
              },
            }),
          },
        )

        if (!response.ok) {
          throw new Error(`Gemini embeddings error: ${response.statusText}`)
        }

        const data = await response.json()
        embedding = data.embedding.values
      }

      embeddings.push(embedding)
    } catch (error) {
      console.error(`[v0] Error generating embedding for chunk:`, error)
      // Use zero vector as fallback
      embeddings.push(new Array(1536).fill(0))
    }
  }

  return embeddings
}

async function storeEmbeddings(userId: string, source: string, chunks: any[], embeddings: number[][]) {
  const batch = adminDb.batch()

  chunks.forEach((chunk, index) => {
    const docRef = adminDb.collection("knowledge_base").doc()
    batch.set(docRef, {
      userId,
      source,
      content: chunk.content,
      metadata: chunk.metadata,
      embedding: embeddings[index],
      createdAt: new Date(),
    })
  })

  await batch.commit()
}

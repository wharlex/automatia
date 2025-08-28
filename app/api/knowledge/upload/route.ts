import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Configuración de tipos de archivo permitidos
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/csv',
  'application/json'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido' },
        { status: 400 }
      )
    }

    // Validar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande (máximo 10MB)' },
        { status: 400 }
      )
    }

    // Crear directorio de uploads si no existe
    const uploadsDir = join(process.cwd(), 'uploads', 'knowledge')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${originalName}`
    const filePath = join(uploadsDir, fileName)

    // Guardar archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Extraer texto del archivo (simulado por ahora)
    const extractedText = await extractTextFromFile(file, buffer)
    
    // Procesar para entrenamiento del chatbot
    const trainingData = await processForChatbotTraining(extractedText, {
      fileName: originalName,
      category,
      description,
      fileType: file.type,
      fileSize: file.size
    })

    // Guardar metadatos del documento
    const documentMetadata = {
      id: timestamp.toString(),
      name: originalName,
      category: category || 'general',
      description: description || '',
      fileType: file.type,
      fileSize: file.size,
      filePath: fileName,
      extractedText: extractedText.substring(0, 500) + '...', // Primeros 500 caracteres
      trainingData: trainingData,
      uploadedAt: new Date().toISOString(),
      status: 'processed'
    }

    // Simular guardado en base de datos
    console.log('📄 Documento procesado:', documentMetadata)

    return NextResponse.json({
      success: true,
      message: 'Documento subido y procesado exitosamente',
      document: documentMetadata,
      trainingStatus: 'ready'
    })

  } catch (error) {
    console.error('Error en upload:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para extraer texto del archivo
async function extractTextFromFile(file: File, buffer: Buffer): Promise<string> {
  const fileType = file.type
  
  try {
    if (fileType === 'text/plain') {
      // Archivo de texto plano
      return buffer.toString('utf-8')
    } else if (fileType === 'application/json') {
      // Archivo JSON
      const jsonContent = JSON.parse(buffer.toString('utf-8'))
      return JSON.stringify(jsonContent, null, 2)
    } else if (fileType === 'text/csv') {
      // Archivo CSV
      return buffer.toString('utf-8')
    } else if (fileType.includes('pdf') || fileType.includes('word')) {
      // Para PDF y Word, simulamos extracción
      // En producción usarías librerías como pdf-parse o mammoth
      return `Contenido extraído de ${file.name}. Este documento ha sido procesado para entrenamiento del chatbot.`
    } else {
      return `Contenido del archivo ${file.name} procesado para entrenamiento.`
    }
  } catch (error) {
    console.error('Error extrayendo texto:', error)
    return `Error al procesar el contenido de ${file.name}.`
  }
}

// Función para procesar el texto para entrenamiento del chatbot
async function processForChatbotTraining(text: string, metadata: any) {
  try {
    // Dividir texto en chunks para entrenamiento
    const chunks = splitTextIntoChunks(text, 1000) // 1000 caracteres por chunk
    
    // Generar preguntas y respuestas simuladas
    const qaPairs = generateQAPairs(text, metadata)
    
    // Crear embeddings simulados (en producción usarías OpenAI, Cohere, etc.)
    const embeddings = chunks.map((chunk, index) => ({
      id: `${metadata.fileName}_chunk_${index}`,
      text: chunk,
      embedding: `embedding_${index}_${Date.now()}`, // Simulado
      metadata: {
        fileName: metadata.fileName,
        category: metadata.category,
        chunkIndex: index
      }
    }))

    return {
      chunks: chunks.length,
      qaPairs: qaPairs.length,
      embeddings: embeddings.length,
      trainingReady: true,
      estimatedTokens: text.length / 4, // Estimación aproximada
      processingTime: Date.now()
    }
  } catch (error) {
    console.error('Error procesando para entrenamiento:', error)
    return {
      chunks: 0,
      qaPairs: 0,
      embeddings: 0,
      trainingReady: false,
      error: error.message
    }
  }
}

// Función para dividir texto en chunks
function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = []
  let currentChunk = ''
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += sentence + '. '
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks
}

// Función para generar pares de pregunta-respuesta
function generateQAPairs(text: string, metadata: any) {
  const qaPairs = []
  
  // Preguntas básicas basadas en el contenido
  const basicQuestions = [
    `¿Qué información contiene ${metadata.fileName}?`,
    `¿Cuál es el propósito de ${metadata.fileName}?`,
    `¿Qué categoría tiene ${metadata.fileName}?`
  ]
  
  basicQuestions.forEach((question, index) => {
    qaPairs.push({
      question,
      answer: `Este documento contiene información sobre ${metadata.category}. ${text.substring(0, 200)}...`,
      confidence: 0.8 + (index * 0.1),
      source: metadata.fileName
    })
  })
  
  return qaPairs
}

export async function GET() {
  try {
    // Endpoint para obtener documentos existentes
    return NextResponse.json({
      success: true,
      documents: [
        {
          id: '1',
          name: 'Manual de Usuario.pdf',
          category: 'manual',
          description: 'Manual completo del usuario',
          uploadedAt: '2025-08-20T10:00:00Z',
          status: 'processed'
        }
      ]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error obteniendo documentos' },
      { status: 500 }
    )
  }
}



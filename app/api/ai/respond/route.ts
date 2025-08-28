import { NextRequest, NextResponse } from 'next/server'

// Simulación de base de conocimiento procesada
const processedKnowledge = [
  {
    id: '1',
    fileName: 'Manual de Usuario.pdf',
    category: 'manual',
    chunks: [
      'Configuración del chatbot: Para configurar tu chatbot, ve a la sección de configuración y personaliza la personalidad, idioma y mensajes.',
      'Conexión de WhatsApp: Conecta tu cuenta de WhatsApp Business escaneando el código QR o configurando manualmente.',
      'Gestión de conversaciones: Monitorea y analiza todas las conversaciones desde el dashboard de analytics.'
    ],
    embeddings: ['embedding_1', 'embedding_2', 'embedding_3'],
    qaPairs: [
      {
        question: '¿Cómo configuro mi chatbot?',
        answer: 'Ve a la sección de configuración y personaliza la personalidad, idioma y mensajes según tus necesidades.',
        confidence: 0.95,
        source: 'Manual de Usuario.pdf'
      },
      {
        question: '¿Cómo conecto WhatsApp?',
        answer: 'Conecta tu cuenta de WhatsApp Business escaneando el código QR o configurando manualmente desde el dashboard.',
        confidence: 0.92,
        source: 'Manual de Usuario.pdf'
      }
    ]
  },
  {
    id: '2',
    fileName: 'Políticas de Empresa.docx',
    category: 'policies',
    chunks: [
      'Políticas de trabajo: Horarios flexibles, trabajo remoto permitido, reuniones semanales obligatorias.',
      'Código de conducta: Respeto mutuo, confidencialidad de información, uso responsable de recursos.',
      'Procedimientos: Reportes mensuales, evaluaciones trimestrales, capacitación continua.'
    ],
    embeddings: ['embedding_4', 'embedding_5', 'embedding_6'],
    qaPairs: [
      {
        question: '¿Cuáles son las políticas de trabajo?',
        answer: 'Incluyen horarios flexibles, trabajo remoto permitido y reuniones semanales obligatorias.',
        confidence: 0.88,
        source: 'Políticas de Empresa.docx'
      }
    ]
  },
  {
    id: '3',
    fileName: 'FAQ General.txt',
    category: 'faq',
    chunks: [
      '¿Cómo funciona el chatbot? El chatbot utiliza IA para responder automáticamente a las consultas de los clientes.',
      '¿Qué idiomas soporta? Actualmente soporta español, inglés y portugués.',
      '¿Cuánto cuesta? Los precios varían según el plan elegido, desde $29/mes hasta $199/mes.'
    ],
    embeddings: ['embedding_7', 'embedding_8', 'embedding_9'],
    qaPairs: [
      {
        question: '¿Cómo funciona el chatbot?',
        answer: 'El chatbot utiliza inteligencia artificial para responder automáticamente a las consultas de los clientes.',
        confidence: 0.96,
        source: 'FAQ General.txt'
      },
      {
        question: '¿Qué idiomas soporta?',
        answer: 'Actualmente soporta español, inglés y portugués.',
        confidence: 0.94,
        source: 'FAQ General.txt'
      },
      {
        question: '¿Cuánto cuesta?',
        answer: 'Los precios varían según el plan elegido, desde $29/mes hasta $199/mes.',
        confidence: 0.91,
        source: 'FAQ General.txt'
      }
    ]
  }
]

export async function POST(request: NextRequest) {
  try {
    const { message, context = 'general', userId } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      )
    }

    // Procesar la pregunta del usuario
    const response = await generateChatbotResponse(message, context, userId)

    return NextResponse.json({
      success: true,
      response: response.answer,
      confidence: response.confidence,
      source: response.source,
      relatedQuestions: response.relatedQuestions,
      processingTime: Date.now()
    })

  } catch (error) {
    console.error('Error generando respuesta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función principal para generar respuestas del chatbot
async function generateChatbotResponse(message: string, context: string, userId: string) {
  const normalizedMessage = message.toLowerCase().trim()
  
  // Buscar la mejor respuesta en la base de conocimiento
  let bestMatch = null
  let highestScore = 0

  // Buscar en todos los documentos
  for (const doc of processedKnowledge) {
    // Buscar en pares de pregunta-respuesta
    for (const qa of doc.qaPairs) {
      const score = calculateSimilarity(normalizedMessage, qa.question.toLowerCase())
      if (score > highestScore && score > 0.6) { // Umbral de similitud
        highestScore = score
        bestMatch = {
          answer: qa.answer,
          confidence: qa.confidence,
          source: qa.source,
          score: score
        }
      }
    }

    // Buscar en chunks de contenido
    for (const chunk of doc.chunks) {
      const score = calculateSimilarity(normalizedMessage, chunk.toLowerCase())
      if (score > highestScore && score > 0.5) {
        highestScore = score
        bestMatch = {
          answer: generateAnswerFromChunk(chunk, normalizedMessage),
          confidence: Math.min(0.8, score),
          source: doc.fileName,
          score: score
        }
      }
    }
  }

  // Si no hay coincidencias buenas, generar respuesta genérica
  if (!bestMatch || bestMatch.confidence < 0.5) {
    return {
      answer: generateGenericResponse(normalizedMessage, context),
      confidence: 0.3,
      source: 'Sistema General',
      relatedQuestions: getRelatedQuestions(normalizedMessage)
    }
  }

  // Generar preguntas relacionadas
  const relatedQuestions = getRelatedQuestions(normalizedMessage, bestMatch.source)

  return {
    answer: bestMatch.answer,
    confidence: bestMatch.confidence,
    source: bestMatch.source,
    relatedQuestions: relatedQuestions
  }
}

// Función para calcular similitud entre textos (simulada)
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.split(/\s+/)
  const words2 = text2.split(/\s+/)
  
  const commonWords = words1.filter(word => 
    words2.includes(word) && word.length > 2
  )
  
  const totalWords = Math.max(words1.length, words2.length)
  const similarity = commonWords.length / totalWords
  
  // Bonus por coincidencias exactas
  if (text1.includes(text2) || text2.includes(text1)) {
    return Math.min(1.0, similarity + 0.3)
  }
  
  return similarity
}

// Función para generar respuesta desde un chunk
function generateAnswerFromChunk(chunk: string, question: string): string {
  // Extraer la parte más relevante del chunk
  const sentences = chunk.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  // Buscar la oración más relevante
  let bestSentence = sentences[0]
  let bestScore = 0
  
  for (const sentence of sentences) {
    const score = calculateSimilarity(question, sentence.toLowerCase())
    if (score > bestScore) {
      bestScore = score
      bestSentence = sentence
    }
  }
  
  return bestSentence.trim() + '.'
}

// Función para generar respuesta genérica
function generateGenericResponse(question: string, context: string): string {
  const genericResponses = [
    'Entiendo tu pregunta. Te recomiendo revisar nuestra documentación o contactar con soporte para obtener información más específica.',
    'Esa es una excelente pregunta. Aunque no tengo la respuesta específica en este momento, puedo ayudarte a encontrar la información correcta.',
    'Para responder a tu consulta de manera precisa, necesitaría más contexto. ¿Podrías reformular tu pregunta?',
    'No tengo información específica sobre eso, pero puedo ayudarte con otras consultas relacionadas con nuestra plataforma.'
  ]
  
  // Seleccionar respuesta basada en el contexto
  const contextIndex = context === 'technical' ? 0 : 
                      context === 'sales' ? 1 : 
                      context === 'support' ? 2 : 3
  
  return genericResponses[contextIndex]
}

// Función para obtener preguntas relacionadas
function getRelatedQuestions(question: string, source?: string): string[] {
  const relatedQuestions = []
  
  // Preguntas relacionadas basadas en palabras clave
  if (question.includes('configurar') || question.includes('configuración')) {
    relatedQuestions.push('¿Cómo personalizo la personalidad del chatbot?')
    relatedQuestions.push('¿Qué idiomas soporta la plataforma?')
    relatedQuestions.push('¿Cómo cambio los mensajes de saludo?')
  }
  
  if (question.includes('whatsapp') || question.includes('conectar')) {
    relatedQuestions.push('¿Cómo genero el código QR?')
    relatedQuestions.push('¿Qué tipos de mensajes puedo enviar?')
    relatedQuestions.push('¿Cómo monitoreo las conversaciones?')
  }
  
  if (question.includes('precio') || question.includes('costo')) {
    relatedQuestions.push('¿Qué planes están disponibles?')
    relatedQuestions.push('¿Hay descuentos para empresas?')
    relatedQuestions.push('¿Puedo cambiar de plan?')
  }
  
  // Si hay una fuente específica, agregar preguntas relacionadas
  if (source) {
    const doc = processedKnowledge.find(d => d.fileName === source)
    if (doc) {
      doc.qaPairs.slice(0, 2).forEach(qa => {
        if (!relatedQuestions.includes(qa.question)) {
          relatedQuestions.push(qa.question)
        }
      })
    }
  }
  
  return relatedQuestions.slice(0, 3) // Máximo 3 preguntas relacionadas
}

export async function GET() {
  try {
    // Endpoint para obtener estadísticas del chatbot
    return NextResponse.json({
      success: true,
      stats: {
        totalDocuments: processedKnowledge.length,
        totalChunks: processedKnowledge.reduce((sum, doc) => sum + doc.chunks.length, 0),
        totalQAPairs: processedKnowledge.reduce((sum, doc) => sum + doc.qaPairs.length, 0),
        totalEmbeddings: processedKnowledge.reduce((sum, doc) => sum + doc.embeddings.length, 0),
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error obteniendo estadísticas' },
      { status: 500 }
    )
  }
}









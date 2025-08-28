import { NextRequest, NextResponse } from 'next/server'

// Simulación de base de conocimiento
const mockKnowledgeBase = [
  {
    id: '1',
    name: 'Manual de Usuario.pdf',
    category: 'manual',
    description: 'Manual completo del usuario con todas las funcionalidades',
    content: 'Este manual describe cómo usar la plataforma Automatía. Incluye configuración del chatbot, conexión de WhatsApp, y gestión de conversaciones.',
    chunks: [
      'Configuración del chatbot: Para configurar tu chatbot, ve a la sección de configuración y personaliza la personalidad, idioma y mensajes.',
      'Conexión de WhatsApp: Conecta tu cuenta de WhatsApp Business escaneando el código QR o configurando manualmente.',
      'Gestión de conversaciones: Monitorea y analiza todas las conversaciones desde el dashboard de analytics.'
    ],
    uploadedAt: '2025-08-20T10:00:00Z',
    status: 'processed'
  },
  {
    id: '2',
    name: 'Políticas de Empresa.docx',
    category: 'policies',
    description: 'Políticas internas y procedimientos de la empresa',
    content: 'Documento que contiene todas las políticas internas de la empresa, procedimientos de trabajo y códigos de conducta.',
    chunks: [
      'Políticas de trabajo: Horarios flexibles, trabajo remoto permitido, reuniones semanales obligatorias.',
      'Código de conducta: Respeto mutuo, confidencialidad de información, uso responsable de recursos.',
      'Procedimientos: Reportes mensuales, evaluaciones trimestrales, capacitación continua.'
    ],
    uploadedAt: '2025-08-18T14:30:00Z',
    status: 'processed'
  },
  {
    id: '3',
    name: 'FAQ General.txt',
    category: 'faq',
    description: 'Preguntas frecuentes sobre productos y servicios',
    content: 'Lista de preguntas frecuentes con respuestas detalladas sobre nuestros productos y servicios.',
    chunks: [
      '¿Cómo funciona el chatbot? El chatbot utiliza IA para responder automáticamente a las consultas de los clientes.',
      '¿Qué idiomas soporta? Actualmente soporta español, inglés y portugués.',
      '¿Cuánto cuesta? Los precios varían según el plan elegido, desde $29/mes hasta $199/mes.'
    ],
    uploadedAt: '2025-08-15T09:15:00Z',
    status: 'processed'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { query, category = 'all', limit = 10 } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query de búsqueda requerida' },
        { status: 400 }
      )
    }

    // Búsqueda semántica simulada
    const searchResults = await performSemanticSearch(query, category, limit)

    return NextResponse.json({
      success: true,
      query,
      results: searchResults,
      totalResults: searchResults.length,
      searchTime: Date.now()
    })

  } catch (error) {
    console.error('Error en búsqueda:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función de búsqueda semántica simulada
async function performSemanticSearch(query: string, category: string, limit: number) {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Filtrar por categoría si se especifica
  let documents = mockKnowledgeBase
  if (category !== 'all') {
    documents = documents.filter(doc => doc.category === category)
  }

  // Algoritmo de búsqueda por relevancia
  const scoredResults = documents.map(doc => {
    let score = 0
    let matches: string[] = []
    let context = ''

    // Buscar en el nombre del archivo
    if (doc.name.toLowerCase().includes(normalizedQuery)) {
      score += 10
      matches.push(`Nombre: ${doc.name}`)
    }

    // Buscar en la descripción
    if (doc.description.toLowerCase().includes(normalizedQuery)) {
      score += 8
      matches.push(`Descripción: ${doc.description}`)
    }

    // Buscar en el contenido
    if (doc.content.toLowerCase().includes(normalizedQuery)) {
      score += 6
      matches.push(`Contenido: ${doc.content.substring(0, 100)}...`)
    }

    // Buscar en chunks específicos
    doc.chunks.forEach((chunk, index) => {
      if (chunk.toLowerCase().includes(normalizedQuery)) {
        score += 5
        context = chunk
        matches.push(`Chunk ${index + 1}: ${chunk.substring(0, 150)}...`)
      }
    })

    // Búsqueda por palabras clave
    const queryWords = normalizedQuery.split(/\s+/)
    queryWords.forEach(word => {
      if (word.length > 2) {
        if (doc.content.toLowerCase().includes(word)) score += 2
        if (doc.description.toLowerCase().includes(word)) score += 3
      }
    })

    // Bonus por fecha reciente
    const daysSinceUpload = (Date.now() - new Date(doc.uploadedAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpload < 7) score += 2
    else if (daysSinceUpload < 30) score += 1

    return {
      ...doc,
      searchScore: score,
      matches,
      context: context || doc.content.substring(0, 200),
      relevance: score > 15 ? 'high' : score > 8 ? 'medium' : 'low'
    }
  })

  // Filtrar resultados con score > 0 y ordenar por relevancia
  const relevantResults = scoredResults
    .filter(result => result.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, limit)

  return relevantResults
}

export async function GET() {
  try {
    // Endpoint para obtener estadísticas de búsqueda
    return NextResponse.json({
      success: true,
      stats: {
        totalDocuments: mockKnowledgeBase.length,
        totalChunks: mockKnowledgeBase.reduce((sum, doc) => sum + doc.chunks.length, 0),
        categories: [...new Set(mockKnowledgeBase.map(doc => doc.category))],
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



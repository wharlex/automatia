import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { title, content, category, tags, type } = await req.json()

    if (!title || !content || !type) {
      return NextResponse.json({ 
        error: "Título, contenido y tipo son requeridos" 
      }, { status: 400 })
    }

    // Crear ID único para el documento
    const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const knowledgeDoc = {
      id: docId,
      title,
      content,
      category: category || "general",
      tags: Array.isArray(tags) ? tags : [],
      type: type, // 'faq', 'product', 'policy', 'custom'
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.uid,
      workspaceId: user.workspaceId || 'default',
      usage: {
        totalQueries: 0,
        successfulMatches: 0,
        lastUsed: null
      },
      metadata: {
        wordCount: content.split(' ').length,
        language: 'es',
        priority: 'medium'
      }
    }

    await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('knowledge')
      .doc(docId)
      .set(knowledgeDoc)

    return NextResponse.json({
      success: true,
      message: "Documento de conocimiento creado exitosamente",
      document: {
        id: docId,
        title,
        category,
        tags,
        type,
        wordCount: knowledgeDoc.metadata.wordCount
      }
    })

  } catch (error) {
    console.error("[Knowledge Create] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const activeOnly = searchParams.get('active') !== 'false'

    let query = adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('knowledge')
      .orderBy('createdAt', 'desc')

    if (activeOnly) {
      query = query.where('isActive', '==', true)
    }

    if (category) {
      query = query.where('category', '==', category)
    }

    if (type) {
      query = query.where('type', '==', type)
    }

    const snapshot = await query.get()
    let documents = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
        type: data.type,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
        usage: data.usage,
        metadata: data.metadata
      }
    })

    // Búsqueda por texto si se especifica
    if (search) {
      const searchLower = search.toLowerCase()
      documents = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchLower) ||
        doc.content.toLowerCase().includes(searchLower) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    return NextResponse.json({ documents })

  } catch (error) {
    console.error("[Knowledge Get] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { docId, updates } = await req.json()

    if (!docId || !updates) {
      return NextResponse.json({ 
        error: "Document ID y updates son requeridos" 
      }, { status: 400 })
    }

    const docRef = adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('knowledge')
      .doc(docId)

    const docSnapshot = await docRef.get()
    if (!docSnapshot.exists) {
      return NextResponse.json({ 
        error: "Documento no encontrado" 
      }, { status: 404 })
    }

    const updateData = {
      ...updates,
      updatedAt: new Date()
    }

    // Actualizar metadata si cambió el contenido
    if (updates.content) {
      updateData.metadata = {
        ...updateData.metadata,
        wordCount: updates.content.split(' ').length
      }
    }

    await docRef.update(updateData)

    return NextResponse.json({
      success: true,
      message: "Documento actualizado exitosamente"
    })

  } catch (error) {
    console.error("[Knowledge Update] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { docId } = await req.json()

    if (!docId) {
      return NextResponse.json({ 
        error: "Document ID es requerido" 
      }, { status: 400 })
    }

    await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('knowledge')
      .doc(docId)
      .delete()

    return NextResponse.json({
      success: true,
      message: "Documento eliminado exitosamente"
    })

  } catch (error) {
    console.error("[Knowledge Delete] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

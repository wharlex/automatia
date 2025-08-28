import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { name, description, triggers, steps, isActive } = await req.json()

    if (!name || !triggers || !steps) {
      return NextResponse.json({ 
        error: "Nombre, triggers y steps son requeridos" 
      }, { status: 400 })
    }

    // Validar estructura del flujo
    if (!Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ 
        error: "El flujo debe tener al menos un paso" 
      }, { status: 400 })
    }

    // Crear ID único para el flujo
    const flowId = `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const flow = {
      id: flowId,
      name,
      description: description || "",
      triggers: Array.isArray(triggers) ? triggers : [triggers],
      steps,
      isActive: isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.uid,
      workspaceId: user.workspaceId || 'default',
      version: 1,
      stats: {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        lastExecuted: null
      }
    }

    await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('flows')
      .doc(flowId)
      .set(flow)

    return NextResponse.json({
      success: true,
      message: "Flujo creado exitosamente",
      flow: {
        id: flowId,
        name,
        description,
        triggers,
        stepsCount: steps.length,
        isActive: flow.isActive
      }
    })

  } catch (error) {
    console.error("[Flows Create] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('active') === 'true'

    let query = adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('flows')
      .orderBy('createdAt', 'desc')

    if (activeOnly) {
      query = query.where('isActive', '==', true)
    }

    const snapshot = await query.get()
    const flows = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        triggers: data.triggers,
        stepsCount: data.steps?.length || 0,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
        stats: data.stats
      }
    })

    return NextResponse.json({ flows })

  } catch (error) {
    console.error("[Flows Get] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { flowId, updates } = await req.json()

    if (!flowId || !updates) {
      return NextResponse.json({ 
        error: "Flow ID y updates son requeridos" 
      }, { status: 400 })
    }

    const flowRef = adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('flows')
      .doc(flowId)

    const flowDoc = await flowRef.get()
    if (!flowDoc.exists) {
      return NextResponse.json({ 
        error: "Flujo no encontrado" 
      }, { status: 404 })
    }

    const updateData = {
      ...updates,
      updatedAt: new Date()
    }

    if (updates.steps) {
      updateData.version = (flowDoc.data()?.version || 1) + 1
    }

    await flowRef.update(updateData)

    return NextResponse.json({
      success: true,
      message: "Flujo actualizado exitosamente"
    })

  } catch (error) {
    console.error("[Flows Update] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { flowId } = await req.json()

    if (!flowId) {
      return NextResponse.json({ 
        error: "Flow ID es requerido" 
      }, { status: 400 })
    }

    await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('flows')
      .doc(flowId)
      .delete()

    return NextResponse.json({
      success: true,
      message: "Flujo eliminado exitosamente"
    })

  } catch (error) {
    console.error("[Flows Delete] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

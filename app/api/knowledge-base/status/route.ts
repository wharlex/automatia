import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)

    const statusDoc = await adminDb.collection("knowledge_base_status").doc(user.uid).get()

    if (!statusDoc.exists) {
      return NextResponse.json({
        configured: false,
        totalDocuments: 0,
        totalChunks: 0,
        lastProcessed: null,
      })
    }

    const status = statusDoc.data()
    return NextResponse.json({
      configured: status.configured || false,
      totalDocuments: status.totalDocuments || 0,
      totalChunks: status.totalChunks || 0,
      lastProcessed: status.lastProcessed?.toDate?.()?.toISOString() || null,
      provider: status.provider || null,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

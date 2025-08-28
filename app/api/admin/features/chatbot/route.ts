import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { enabled } = await req.json()

    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: "Enabled flag required" }, { status: 400 })
    }

    // Update chatbot feature flag
    await adminDb.collection("features").doc("chatbot").set({
      enabled,
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, enabled })
  } catch (error) {
    console.error("[v0] Chatbot feature error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    
    const doc = await adminDb.collection("features").doc("chatbot").get()
    const enabled = doc.exists ? doc.data()?.enabled ?? false : false

    return NextResponse.json({ enabled })
  } catch (error) {
    console.error("[v0] Chatbot feature error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

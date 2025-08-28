import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { ClaimsManager } from "@/lib/claims"

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const result = await ClaimsManager.syncUserClaims(email)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Claims sync error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

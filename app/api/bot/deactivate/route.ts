import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)

    await adminDb.collection("bot_status").doc(user.uid).set(
      {
        active: false,
        deactivatedAt: new Date(),
        lastDeactivation: new Date(),
      },
      { merge: true },
    )

    // Log deactivation event
    await adminDb.collection("bot_events").add({
      userId: user.uid,
      type: "deactivation",
      message: "Bot deactivated by user",
      timestamp: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Bot desactivado correctamente",
      status: "inactive",
      deactivatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { encrypt } from "@/lib/secretsServer"
import { adminDb } from "@/lib/firebaseAdmin"

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)

    const secretDoc = await adminDb.collection("secrets").doc(`${user.uid}_llm`).get()

    if (!secretDoc.exists) {
      return NextResponse.json({ configured: false })
    }

    const data = secretDoc.data()
    return NextResponse.json({
      configured: true,
      provider: data.provider,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { provider, apiKey } = await req.json()

    if (!apiKey || !provider) {
      return NextResponse.json({ error: "Provider and API key required" }, { status: 400 })
    }

    const encryptedKey = encrypt(apiKey)

    await adminDb.collection("secrets").doc(`${user.uid}_llm`).set({
      provider,
      encValue: encryptedKey,
      ownerUid: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"
import { encrypt, decrypt } from "@/lib/secretsServer"

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const secretDoc = await adminDb.collection("secrets").doc(`${user.uid}_whatsapp`).get()

    if (!secretDoc.exists) {
      return NextResponse.json({ configured: false })
    }

    return NextResponse.json({
      configured: true,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://automatia.ar"}/api/webhooks/whatsapp/${user.uid}`,
      verifyToken: decrypt(secretDoc.data().webhookVerifyToken),
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { metaAppId, metaAppSecret, wabaId, phoneNumberId, permanentToken, webhookVerifyToken } = await req.json()

    const secretData = {
      metaAppId: encrypt(metaAppId),
      metaAppSecret: encrypt(metaAppSecret),
      wabaId: encrypt(wabaId),
      phoneNumberId: encrypt(phoneNumberId),
      permanentToken: encrypt(permanentToken),
      webhookVerifyToken: encrypt(webhookVerifyToken),
      updatedAt: new Date(),
    }

    await adminDb.collection("secrets").doc(`${user.uid}_whatsapp`).set(secretData)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

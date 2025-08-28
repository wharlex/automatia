import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"
import { decrypt } from "@/lib/secretsServer"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)

    const secretDoc = await adminDb.collection("secrets").doc(`${user.uid}_whatsapp`).get()

    if (!secretDoc.exists) {
      return NextResponse.json({ success: false, error: "WhatsApp no configurado" }, { status: 400 })
    }

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://automatia.ar"}/api/webhooks/whatsapp/${user.uid}`
    const verifyToken = decrypt(secretDoc.data().webhookVerifyToken)

    // Test webhook verification
    const testUrl = `${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=test123`

    try {
      const response = await fetch(testUrl, { method: "GET" })
      const responseText = await response.text()

      if (response.ok && responseText === "test123") {
        return NextResponse.json({
          success: true,
          message: "Webhook verificado correctamente",
          webhookUrl,
          verifyToken,
        })
      } else {
        return NextResponse.json({
          success: false,
          error: "Webhook no responde correctamente",
          details: `Status: ${response.status}, Response: ${responseText}`,
        })
      }
    } catch (fetchError) {
      return NextResponse.json({
        success: false,
        error: "No se puede conectar al webhook",
        details: fetchError.message,
      })
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

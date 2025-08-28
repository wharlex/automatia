import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { adminDb } from "@/lib/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { phoneNumberId, accessToken, verifyToken, businessName } = await req.json()

    if (!phoneNumberId || !accessToken || !verifyToken || !businessName) {
      return NextResponse.json({ 
        error: "Todos los campos son requeridos" 
      }, { status: 400 })
    }

    // Verificar que el token de acceso sea válido
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}?fields=verified_name,code_verification_status&access_token=${accessToken}`)
      const data = await response.json()
      
      if (!response.ok || data.error) {
        return NextResponse.json({ 
          error: "Token de acceso inválido o número no verificado" 
        }, { status: 400 })
      }

      if (data.code_verification_status !== 'VERIFIED') {
        return NextResponse.json({ 
          error: "El número de WhatsApp debe estar verificado" 
        }, { status: 400 })
      }
    } catch (error) {
      return NextResponse.json({ 
        error: "Error al verificar credenciales de WhatsApp" 
      }, { status: 400 })
    }

    // Guardar configuración en Firestore
    const whatsappConfig = {
      phoneNumberId,
      accessToken,
      verifyToken,
      businessName,
      isConnected: true,
      connectedAt: new Date(),
      status: 'active',
      userId: user.uid,
      workspaceId: user.workspaceId || 'default'
    }

    await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('whatsapp')
      .doc('config')
      .set(whatsappConfig)

    // Crear webhook URL
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/whatsapp/${user.workspaceId || 'default'}`

    return NextResponse.json({
      success: true,
      message: "WhatsApp conectado exitosamente",
      webhookUrl,
      config: whatsappConfig
    })

  } catch (error) {
    console.error("[WhatsApp Connect] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    
    const configDoc = await adminDb
      .collection('workspaces')
      .doc(user.workspaceId || 'default')
      .collection('whatsapp')
      .doc('config')
      .get()

    if (!configDoc.exists) {
      return NextResponse.json({ 
        isConnected: false,
        config: null 
      })
    }

    const config = configDoc.data()
    return NextResponse.json({
      isConnected: config?.isConnected || false,
      config: {
        businessName: config?.businessName,
        phoneNumberId: config?.phoneNumberId,
        connectedAt: config?.connectedAt?.toDate?.()?.toISOString(),
        status: config?.status
      }
    })

  } catch (error) {
    console.error("[WhatsApp Config] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

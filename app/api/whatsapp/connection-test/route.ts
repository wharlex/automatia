import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { WhatsAppService } from "@/lib/whatsapp"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)

    const whatsapp = await WhatsAppService.fromUserId(user.uid)
    const result = await whatsapp.testConnection()

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message === "WhatsApp not configured" ? "Configuración de WhatsApp no encontrada" : error.message,
      },
      { status: 400 },
    )
  }
}

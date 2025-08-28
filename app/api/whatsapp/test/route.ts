import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { WhatsAppService } from "@/lib/whatsapp"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { testNumber } = await req.json()

    if (!testNumber) {
      return NextResponse.json({ error: "Test number is required" }, { status: 400 })
    }

    const whatsapp = await WhatsAppService.fromUserId(user.uid)
    const result = await whatsapp.sendTestMessage(testNumber)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { WhatsAppService } from "@/lib/whatsapp"
import { BotRouter, type RouterContext } from "@/lib/bot-router"
import { adminDb } from "@/lib/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const { testNumber, testMessage } = await req.json()

    if (!testNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Número de prueba requerido",
        },
        { status: 400 },
      )
    }

    const testMsg = testMessage || "Hola, esta es una prueba del bot. ¿Funciona correctamente?"

    try {
      // Send test message via WhatsApp
      const whatsapp = await WhatsAppService.fromUserId(user.uid)
      const sendResult = await whatsapp.sendMessage({
        to: testNumber,
        type: "text",
        text: { body: testMsg },
      })

      if (!sendResult.success) {
        return NextResponse.json({
          success: false,
          error: "Error enviando mensaje de prueba: " + sendResult.error,
        })
      }

      // Simulate bot response processing
      const router = new BotRouter(user.uid)
      const context: RouterContext = {
        userId: user.uid,
        source: "whatsapp",
        userPhone: testNumber,
        conversationHistory: [],
      }

      const botResponse = await router.processMessage(context, testMsg)

      // Send bot response
      const responseResult = await whatsapp.sendMessage({
        to: testNumber,
        type: "text",
        text: { body: botResponse },
      })

      // Log test event
      await adminDb.collection("bot_events").add({
        userId: user.uid,
        type: "final_test",
        message: "Final test completed",
        details: {
          testNumber,
          testMessage: testMsg,
          botResponse,
          sendSuccess: sendResult.success,
          responseSuccess: responseResult.success,
        },
        timestamp: new Date(),
      })

      return NextResponse.json({
        success: true,
        message: "Prueba final completada exitosamente",
        details: {
          messageSent: sendResult.success,
          messageId: sendResult.messageId,
          botResponse: botResponse.substring(0, 100) + "...",
          testNumber,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (testError) {
      return NextResponse.json({
        success: false,
        error: "Error en la prueba final: " + testError.message,
      })
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

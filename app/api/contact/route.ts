import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Schema de validación para el formulario de contacto
const ContactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(1, "Debes seleccionar un asunto"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validar los datos del formulario
    const validatedData = ContactSchema.parse(body)
    
    // Aquí puedes implementar el envío real del email
    // Por ahora, simulamos el envío exitoso
    
    // Opción 1: Enviar email usando un servicio como SendGrid, Resend, o similar
    // await sendEmail({
    //   to: "contacto@automatia.store",
    //   from: "noreply@automatia.store",
    //   subject: `Nuevo mensaje de contacto: ${validatedData.subject}`,
    //   html: `
    //     <h2>Nuevo mensaje de contacto</h2>
    //     <p><strong>Nombre:</strong> ${validatedData.name}</p>
    //     <p><strong>Email:</strong> ${validatedData.email}</p>
    //     <p><strong>Asunto:</strong> ${validatedData.subject}</p>
    //     <p><strong>Mensaje:</strong></p>
    //     <p>${validatedData.message}</p>
    //   `
    // })
    
    // Opción 2: Guardar en base de datos para seguimiento
    // await db.contactMessage.create({
    //   data: {
    //     name: validatedData.name,
    //     email: validatedData.email,
    //     subject: validatedData.subject,
    //     message: validatedData.message,
    //     createdAt: new Date()
    //   }
    // })
    
    // Opción 3: Enviar notificación a Slack/Discord
    // await sendSlackNotification({
    //   channel: "#contactos",
    //   text: `Nuevo mensaje de ${validatedData.name} (${validatedData.email}): ${validatedData.subject}`
    // })
    
    // Log del mensaje recibido (para debugging)
    console.log("Nuevo mensaje de contacto recibido:", {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      timestamp: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || req.ip || "unknown"
    })
    
    // Respuesta exitosa
    return NextResponse.json({ 
      success: true, 
      message: "Mensaje enviado exitosamente. Te responderemos en menos de 24 horas." 
    })
    
  } catch (error) {
    console.error("Error procesando formulario de contacto:", error)
    
    if (error instanceof z.ZodError) {
      // Error de validación
      return NextResponse.json({ 
        success: false, 
        message: "Datos del formulario inválidos",
        errors: error.errors 
      }, { status: 400 })
    }
    
    // Error interno del servidor
    return NextResponse.json({ 
      success: false, 
      message: "Error interno del servidor. Por favor, intenta nuevamente." 
    }, { status: 500 })
  }
}

// GET method para verificar que el endpoint está funcionando
export async function GET() {
  return NextResponse.json({ 
    message: "API de contacto funcionando correctamente",
    timestamp: new Date().toISOString()
  })
}








import { NextResponse } from "next/server"
import { incomingQ } from "@/lib/queue"

export async function POST(req: Request) {
  try {
    // Verificar token de admin (simplificado por ahora)
    const adminToken = req.headers.get('x-admin-token')
    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Resumir la cola
    await incomingQ.resume()
    
    return NextResponse.json({ 
      message: "Queue resumed successfully",
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("[Queue Resume] Error:", error)
    return NextResponse.json({
      error: "Failed to resume queue",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

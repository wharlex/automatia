import { NextResponse } from "next/server"
import { incomingQ } from "@/lib/queue"

export async function POST(req: Request) {
  try {
    // Verificar token de admin (simplificado por ahora)
    const adminToken = req.headers.get('x-admin-token')
    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Pausar la cola
    await incomingQ.pause()
    
    return NextResponse.json({ 
      message: "Queue paused successfully",
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("[Queue Pause] Error:", error)
    return NextResponse.json({
      error: "Failed to pause queue",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

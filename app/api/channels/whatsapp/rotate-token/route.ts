import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { seal } from "@/lib/crypto"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    // Verificar token de admin
    const adminToken = req.headers.get('x-admin-token')
    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { channelId, accessToken } = await req.json()
    
    if (!channelId || !accessToken) {
      return NextResponse.json({ 
        error: "Missing channelId or accessToken" 
      }, { status: 400 })
    }
    
    // Encriptar el nuevo token
    const encryptedToken = seal(accessToken)
    
    // Actualizar el canal
    const updatedChannel = await prisma.channel.update({
      where: { id: channelId },
      data: { 
        accessToken: encryptedToken,
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json({
      message: "Token rotated successfully",
      channelId: updatedChannel.id,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("[Token Rotation] Error:", error)
    return NextResponse.json({
      error: "Failed to rotate token",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Verificar si hay un bot activo
    const activeBot = await prisma.bot.findFirst({
      where: { status: "live" },
      include: {
        defaultProvider: true,
        defaultFlow: true
      }
    })
    
    // Verificar si hay canales activos
    const activeChannels = await prisma.channel.findMany({
      where: { isActive: true }
    })
    
    // Verificar si hay flows activos
    const activeFlows = await prisma.flow.findMany({
      where: { status: "live" }
    })
    
    // Verificar si hay providers configurados
    const providers = await prisma.provider.findMany()
    
    const checks = {
      provider: providers.length > 0,
      flow: activeFlows.length > 0,
      channels: {
        whatsapp: activeChannels.some(c => c.type === "whatsapp_cloud"),
        telegram: activeChannels.some(c => c.type === "telegram"),
        webchat: activeChannels.some(c => c.type === "webchat")
      }
    }
    
    const ok = checks.provider && checks.flow && Object.values(checks.channels).some(Boolean)
    
    return NextResponse.json({
      ok,
      checks,
      bot: activeBot ? {
        id: activeBot.id,
        name: activeBot.name,
        status: activeBot.status
      } : null,
      channels: activeChannels.map(c => ({
        id: c.id,
        type: c.type,
        isActive: c.isActive
      })),
      flows: activeFlows.map(f => ({
        id: f.id,
        name: f.name,
        status: f.status
      })),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("[Status] Error:", error)
    return NextResponse.json({
      ok: false,
      error: "Failed to check status",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

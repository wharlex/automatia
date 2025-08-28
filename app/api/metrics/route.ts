import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Contadores básicos
    const totalMessages = await prisma.message.count()
    const totalChannels = await prisma.channel.count()
    const totalFlows = await prisma.flow.count()
    const totalBots = await prisma.bot.count()
    
    // Métricas por canal
    const messagesByChannel = await prisma.message.groupBy({
      by: ['channelId'],
      _count: { id: true }
    })
    
    // Métricas por bot
    const messagesByBot = await prisma.message.groupBy({
      by: ['botId'],
      _count: { id: true }
    })
    
    const metrics = {
      // Contadores totales
      total_messages: totalMessages,
      total_channels: totalChannels,
      total_flows: totalFlows,
      total_bots: totalBots,
      
      // Métricas por canal
      messages_by_channel: messagesByChannel.map(m => ({
        channel_id: m.channelId,
        count: m._count.id
      })),
      
      // Métricas por bot
      messages_by_bot: messagesByBot.map(m => ({
        bot_id: m.botId,
        count: m._count.id
      })),
      
      // Timestamp
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(metrics)
    
  } catch (error) {
    console.error("[Metrics] Error:", error)
    return NextResponse.json({
      error: "Failed to get metrics",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

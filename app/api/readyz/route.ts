import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import IORedis from "ioredis"

const prisma = new PrismaClient()
const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379")

export async function GET() {
  try {
    // Verificar DB
    const dbOk = await prisma.$queryRaw`SELECT 1` ? true : false
    
    // Verificar Redis
    const redisOk = await redis.ping() === "PONG"
    
    // Verificar Queue (opcional)
    const queueOk = true // Por ahora siempre true, se puede implementar verificación real
    
    const allOk = dbOk && redisOk && queueOk
    
    return NextResponse.json({
      ok: allOk,
      db: dbOk,
      redis: redisOk,
      queue: queueOk,
      timestamp: new Date().toISOString()
    }, { status: allOk ? 200 : 503 })
    
  } catch (error) {
    console.error("[Readyz] Error:", error)
    return NextResponse.json({
      ok: false,
      error: "Service unavailable",
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}

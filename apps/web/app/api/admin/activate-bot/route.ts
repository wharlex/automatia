import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import { db } from "@packages/db"
import { z } from "zod"

const Body = z.object({
  botId: z.string().min(1),
  isBotActivated: z.boolean()
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin/owner
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { memberships: true }
    })

    if (!user || !user.memberships.some(m => ["OWNER", "ADMIN"].includes(m.role))) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const json = await req.json()
    const parsed = Body.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { botId, isBotActivated } = parsed.data

    // Get the bot to update
    const bot = await db.bot.findUnique({
      where: { id: botId },
      include: { workspace: true }
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Check if admin has access to this workspace
    const adminMembership = user.memberships.find(m => m.workspaceId === bot.workspaceId)
    if (!adminMembership || !["OWNER", "ADMIN"].includes(adminMembership.role)) {
      return NextResponse.json({ error: "Access denied to this workspace" }, { status: 403 })
    }

    // Update bot activation status
    const updatedBot = await db.bot.update({
      where: { id: botId },
      data: { isBotActivated },
      include: { workspace: true }
    })

    // Log the action in AuditLog
    await db.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        entityType: "BOT",
        entityId: botId,
        action: isBotActivated ? "ACTIVATE_BOT" : "DEACTIVATE_BOT",
        details: {
          botId,
          botName: bot.name,
          workspaceId: bot.workspaceId,
          workspaceName: bot.workspace.name,
          previousStatus: !isBotActivated,
          newStatus: isBotActivated
        },
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown"
      }
    })

    return NextResponse.json({
      success: true,
      bot: updatedBot
    })

  } catch (error) {
    console.error("[admin/activate-bot] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

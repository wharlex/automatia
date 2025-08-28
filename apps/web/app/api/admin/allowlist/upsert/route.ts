import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import { db } from "@packages/db"
import { z } from "zod"

const Body = z.object({
  botId: z.string().min(1),
  email: z.string().email(),
  action: z.enum(["add", "remove"])
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

    const { botId, email, action } = parsed.data

    // Get the bot to verify access
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

    if (action === "add") {
      // Check if email already exists in allowlist
      const existing = await db.allowedUser.findFirst({
        where: { botId, email }
      })

      if (existing) {
        return NextResponse.json({ error: "Email already in allowlist" }, { status: 400 })
      }

      // Add email to allowlist
      const allowedUser = await db.allowedUser.create({
        data: {
          botId,
          email,
          addedBy: user.email
        }
      })

      // Log the action in AuditLog
      await db.auditLog.create({
        data: {
          actorId: user.id,
          actorEmail: user.email,
          entityType: "ALLOWED_USER",
          entityId: allowedUser.id,
          action: "ADD_TO_ALLOWLIST",
          details: {
            botId,
            botName: bot.name,
            email,
            workspaceId: bot.workspaceId,
            workspaceName: bot.workspace.name
          },
          ipAddress: req.headers.get("x-forwarded-for") || "unknown",
          userAgent: req.headers.get("user-agent") || "unknown"
        }
      })

      return NextResponse.json({
        success: true,
        allowedUser
      })

    } else if (action === "remove") {
      // Remove email from allowlist
      const deleted = await db.allowedUser.deleteMany({
        where: { botId, email }
      })

      if (deleted.count === 0) {
        return NextResponse.json({ error: "Email not found in allowlist" }, { status: 404 })
      }

      // Log the action in AuditLog
      await db.auditLog.create({
        data: {
          actorId: user.id,
          actorEmail: user.email,
          entityType: "ALLOWED_USER",
          entityId: "deleted",
          action: "REMOVE_FROM_ALLOWLIST",
          details: {
            botId,
            botName: bot.name,
            email,
            workspaceId: bot.workspaceId,
            workspaceName: bot.workspace.name
          },
          ipAddress: req.headers.get("x-forwarded-for") || "unknown",
          userAgent: req.headers.get("user-agent") || "unknown"
        }
      })

      return NextResponse.json({
        success: true,
        message: "Email removed from allowlist"
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })

  } catch (error) {
    console.error("[admin/allowlist/upsert] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

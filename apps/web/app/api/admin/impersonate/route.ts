import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import { db } from "@packages/db"
import { z } from "zod"

const StartBody = z.object({
  targetUserId: z.string().min(1),
  targetWorkspaceId: z.string().min(1)
})

const StopBody = z.object({
  sessionId: z.string().min(1)
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
    const action = json.action

    if (action === "start") {
      const parsed = StartBody.safeParse(json)
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
      }

      const { targetUserId, targetWorkspaceId } = parsed.data

      // Verify target user exists and is approved
      const targetUser = await db.user.findUnique({
        where: { id: targetUserId },
        include: { memberships: true }
      })

      if (!targetUser) {
        return NextResponse.json({ error: "Target user not found" }, { status: 404 })
      }

      // Check if target user has access to the workspace
      const targetMembership = targetUser.memberships.find(m => m.workspaceId === targetWorkspaceId)
      if (!targetMembership || !targetMembership.isApproved) {
        return NextResponse.json({ error: "Target user not approved for this workspace" }, { status: 403 })
      }

      // Check if admin has access to this workspace
      const adminMembership = user.memberships.find(m => m.workspaceId === targetWorkspaceId)
      if (!adminMembership || !["OWNER", "ADMIN"].includes(adminMembership.role)) {
        return NextResponse.json({ error: "Access denied to this workspace" }, { status: 403 })
      }

      // Create impersonation session
      const impersonationSession = await db.auditLog.create({
        data: {
          actorId: user.id,
          actorEmail: user.email,
          entityType: "USER",
          entityId: targetUserId,
          action: "START_IMPERSONATION",
          details: {
            targetUserId,
            targetUserEmail: targetUser.email,
            targetWorkspaceId,
            sessionId: `imp_${Date.now()}_${user.id}_${targetUserId}`
          },
          ipAddress: req.headers.get("x-forwarded-for") || "unknown",
          userAgent: req.headers.get("user-agent") || "unknown"
        }
      })

      return NextResponse.json({
        success: true,
        sessionId: impersonationSession.details.sessionId,
        targetUser: {
          id: targetUser.id,
          email: targetUser.email,
          name: targetUser.name
        },
        workspaceId: targetWorkspaceId
      })

    } else if (action === "stop") {
      const parsed = StopBody.safeParse(json)
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
      }

      const { sessionId } = parsed.data

      // Log the end of impersonation
      await db.auditLog.create({
        data: {
          actorId: user.id,
          actorEmail: user.email,
          entityType: "USER",
          entityId: "impersonation",
          action: "STOP_IMPERSONATION",
          details: {
            sessionId
          },
          ipAddress: req.headers.get("x-forwarded-for") || "unknown",
          userAgent: req.headers.get("user-agent") || "unknown"
        }
      })

      return NextResponse.json({
        success: true,
        message: "Impersonation stopped"
      })

    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

  } catch (error) {
    console.error("[admin/impersonate] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

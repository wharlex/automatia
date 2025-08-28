import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import { db } from "@packages/db"
import { z } from "zod"

const Body = z.object({
  membershipId: z.string().min(1),
  isApproved: z.boolean()
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

    const { membershipId, isApproved } = parsed.data

    // Get the membership to update
    const membership = await db.membership.findUnique({
      where: { id: membershipId },
      include: { workspace: true, user: true }
    })

    if (!membership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 })
    }

    // Check if admin has access to this workspace
    const adminMembership = user.memberships.find(m => m.workspaceId === membership.workspaceId)
    if (!adminMembership || !["OWNER", "ADMIN"].includes(adminMembership.role)) {
      return NextResponse.json({ error: "Access denied to this workspace" }, { status: 403 })
    }

    // Update membership approval status
    const updatedMembership = await db.membership.update({
      where: { id: membershipId },
      data: { isApproved },
      include: { user: true, workspace: true }
    })

    // Log the action in AuditLog
    await db.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        entityType: "MEMBERSHIP",
        entityId: membershipId,
        action: isApproved ? "APPROVE_MEMBER" : "REVOKE_MEMBER",
        details: {
          targetUserId: membership.userId,
          targetUserEmail: membership.user.email,
          workspaceId: membership.workspaceId,
          workspaceName: membership.workspace.name,
          previousStatus: !isApproved,
          newStatus: isApproved
        },
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown"
      }
    })

    return NextResponse.json({
      success: true,
      membership: updatedMembership
    })

  } catch (error) {
    console.error("[admin/approve-member] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

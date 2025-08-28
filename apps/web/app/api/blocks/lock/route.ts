import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/options"
import { db } from "@packages/db"
import { z } from "zod"

const Body = z.object({
  blockId: z.string().min(1),
  lockedByAdmin: z.boolean().optional(),
  editableByClient: z.boolean().optional()
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const parsed = Body.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { blockId, lockedByAdmin, editableByClient } = parsed.data

    // Get the block to verify access
    const block = await db.configBlock.findUnique({
      where: { id: blockId },
      include: { workspace: true }
    })

    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 })
    }

    // Get user and membership
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { memberships: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const membership = user.memberships.find(m => m.workspaceId === block.workspaceId)
    if (!membership || !membership.isApproved) {
      return NextResponse.json({ error: "Access denied to this workspace" }, { status: 403 })
    }

    // Only admins and owners can lock/unlock blocks
    if (!["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json({ error: "Insufficient permissions to lock/unlock blocks" }, { status: 403 })
    }

    // Prepare update data
    const updateData: any = {}
    if (lockedByAdmin !== undefined) updateData.lockedByAdmin = lockedByAdmin
    if (editableByClient !== undefined) updateData.editableByClient = editableByClient
    updateData.updatedAt = new Date()

    // Update block permissions
    const updatedBlock = await db.configBlock.update({
      where: { id: blockId },
      data: updateData
    })

    // Log the action in AuditLog
    await db.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        entityType: "CONFIG_BLOCK",
        entityId: blockId,
        action: "UPDATE_PERMISSIONS",
        details: {
          blockId,
          blockKey: block.key,
          workspaceId: block.workspaceId,
          workspaceName: block.workspace.name,
          previousLockedByAdmin: block.lockedByAdmin,
          newLockedByAdmin: lockedByAdmin,
          previousEditableByClient: block.editableByClient,
          newEditableByClient: editableByClient
        },
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown"
      }
    })

    return NextResponse.json({
      success: true,
      block: updatedBlock
    })

  } catch (error) {
    console.error("[blocks/lock] error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

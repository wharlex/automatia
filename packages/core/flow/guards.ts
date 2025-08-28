import { PrismaClient } from "@prisma/client";

export async function guardAccess(params: {
  userEmail: string;
  workspaceId: string;
  botId: string;
}, prisma: PrismaClient): Promise<{ ok: true } | { ok: false; reason: "membership-not-approved"|"bot-not-activated"|"not-in-allowlist" }> {
  const m = await prisma.membership.findFirst({ 
    where: { 
      workspaceId: params.workspaceId, 
      user: { email: params.userEmail } 
    }
  });
  if (!m?.isApproved) return { ok: false, reason: "membership-not-approved" };

  const bot = await prisma.bot.findUnique({ where: { id: params.botId }});
  if (!bot?.isBotActivated) return { ok: false, reason: "bot-not-activated" };

  const allowCount = await prisma.allowedUser.count({ where: { botId: params.botId }});
  if (allowCount > 0) {
    const allowed = await prisma.allowedUser.findFirst({ 
      where: { botId: params.botId, email: params.userEmail }
    });
    if (!allowed) return { ok: false, reason: "not-in-allowlist" };
  }
  return { ok: true };
}

import { FlowContext, GuardResult } from '../FlowEngine/types';
import { PrismaClient } from '@prisma/client';

export class GuardService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async checkGuards(checks: string[], context: FlowContext): Promise<GuardResult> {
    for (const check of checks) {
      const result = await this.executeGuard(check, context);
      if (!result.allowed) {
        return result;
      }
    }

    return { allowed: true };
  }

  private async executeGuard(check: string, context: FlowContext): Promise<GuardResult> {
    switch (check) {
      case 'membership-approved':
        return this.checkMembershipApproved(context);
      
      case 'bot-activated':
        return this.checkBotActivated(context);
      
      case 'email-allowlist':
        return this.checkEmailAllowlist(context);
      
      default:
        return {
          allowed: false,
          reason: `Unknown guard: ${check}`
        };
    }
  }

  private async checkMembershipApproved(context: FlowContext): Promise<GuardResult> {
    if (!context.userId) {
      return {
        allowed: false,
        reason: 'User ID not provided',
        nextStep: 'error_unauthorized'
      };
    }

    try {
      const membership = await this.prisma.membership.findFirst({
        where: {
          userId: context.userId,
          workspaceId: context.workspaceId
        }
      });

      if (!membership) {
        return {
          allowed: false,
          reason: 'User not a member of this workspace',
          nextStep: 'error_unauthorized'
        };
      }

      if (!membership.isApproved) {
        return {
          allowed: false,
          reason: 'Membership not approved by admin',
          nextStep: 'error_pending_approval'
        };
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        reason: `Database error: ${error}`,
        nextStep: 'error_system'
      };
    }
  }

  private async checkBotActivated(context: FlowContext): Promise<GuardResult> {
    try {
      const bot = await this.prisma.bot.findUnique({
        where: { id: context.botId }
      });

      if (!bot) {
        return {
          allowed: false,
          reason: 'Bot not found',
          nextStep: 'error_not_found'
        };
      }

      if (!bot.isBotActivated) {
        return {
          allowed: false,
          reason: 'Bot not activated by admin',
          nextStep: 'error_bot_inactive'
        };
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        reason: `Database error: ${error}`,
        nextStep: 'error_system'
      };
    }
  }

  private async checkEmailAllowlist(context: FlowContext): Promise<GuardResult> {
    if (!context.userEmail) {
      return {
        allowed: false,
        reason: 'User email not provided',
        nextStep: 'error_unauthorized'
      };
    }

    try {
      // Verificar si existe lista blanca para este bot
      const allowedUsers = await this.prisma.allowedUser.findMany({
        where: { botId: context.botId }
      });

      // Si no hay lista blanca, permitir acceso
      if (allowedUsers.length === 0) {
        return { allowed: true };
      }

      // Si hay lista blanca, verificar que el email esté incluido
      const isAllowed = allowedUsers.some(au => au.email === context.userEmail);
      
      if (!isAllowed) {
        return {
          allowed: false,
          reason: 'Email not in allowlist',
          nextStep: 'error_not_whitelisted'
        };
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        reason: `Database error: ${error}`,
        nextStep: 'error_system'
      };
    }
  }

  // Método para verificar si un usuario puede acceder a un bot específico
  async canAccessBot(userId: string, botId: string): Promise<GuardResult> {
    try {
      // Obtener el bot y su workspace
      const bot = await this.prisma.bot.findUnique({
        where: { id: botId },
        include: { workspace: true }
      });

      if (!bot) {
        return {
          allowed: false,
          reason: 'Bot not found'
        };
      }

      // Verificar membresía y aprobación
      const membership = await this.prisma.membership.findFirst({
        where: {
          userId,
          workspaceId: bot.workspaceId
        }
      });

      if (!membership) {
        return {
          allowed: false,
          reason: 'User not a member of this workspace'
        };
      }

      if (!membership.isApproved) {
        return {
          allowed: false,
          reason: 'Membership not approved by admin'
        };
      }

      if (!bot.isBotActivated) {
        return {
          allowed: false,
          reason: 'Bot not activated by admin'
        };
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        reason: `System error: ${error}`
      };
    }
  }

  // Método para verificar permisos de administración
  async canManageWorkspace(userId: string, workspaceId: string): Promise<GuardResult> {
    try {
      const membership = await this.prisma.membership.findFirst({
        where: {
          userId,
          workspaceId
        }
      });

      if (!membership) {
        return {
          allowed: false,
          reason: 'User not a member of this workspace'
        };
      }

      if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
        return {
          allowed: false,
          reason: 'Insufficient permissions'
        };
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        reason: `System error: ${error}`
      };
    }
  }
}

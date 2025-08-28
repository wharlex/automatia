import { z } from 'zod';

export const ChatbotConfigSchema = z.object({
  bot: z.object({
    name: z.string().min(1, "El nombre del bot es requerido"),
    language: z.enum(['es', 'en']),
    persona: z.enum(['Profesional', 'Amigable', 'Directo'])
  }),
  llm: z.object({
    provider: z.enum(['openai', 'gemini', 'anthropic']),
    apiKey: z.string().optional(),
    baseUrl: z.string().url().optional(),
    model: z.string().min(1, "El modelo es requerido")
  }),
  channels: z.object({
    whatsapp: z.object({
      active: z.boolean(),
      channelId: z.string().min(1),
      phoneNumberId: z.string().min(1),
      verifyToken: z.string().min(1),
      appSecret: z.string().min(1),
      accessToken: z.string().min(1)
    }).optional(),
    telegram: z.object({
      active: z.boolean(),
      channelId: z.string().min(1),
      botToken: z.string().regex(/^\d+:[\w-]{30,}$/, "Token de Telegram inválido")
    }).optional(),
    webchat: z.object({
      active: z.boolean(),
      channelId: z.string().min(1),
      publicSlug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug debe ser solo letras minúsculas, números y guiones")
    }).optional()
  }),
  flow: z.object({
    defaultFlowId: z.string().min(1, "El ID del flow es requerido")
  }),
  status: z.enum(['draft', 'live'])
}).refine((data) => {
  // Si status es 'live', validar que todo esté configurado correctamente
  if (data.status === 'live') {
    // Debe tener al menos un canal activo
    const hasActiveChannel = Object.values(data.channels).some(channel => channel?.active);
    if (!hasActiveChannel) {
      return false;
    }
    
    // Debe tener flow configurado
    if (!data.flow.defaultFlowId) {
      return false;
    }
    
    // Debe tener provider configurado
    if (!data.llm.provider || !data.llm.model) {
      return false;
    }
  }
  
  return true;
}, {
  message: "Para publicar el bot, debe tener al menos un canal activo, un flow configurado y un provider LLM",
  path: ["status"]
});

export type ChatbotConfig = z.infer<typeof ChatbotConfigSchema>;

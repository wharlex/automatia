export type ChatbotConfig = {
  bot: { 
    name: string; 
    language: 'es'|'en'; 
    persona: 'Profesional'|'Amigable'|'Directo' 
  };
  llm: { 
    provider: 'openai'|'gemini'|'anthropic'; 
    apiKey?: string; 
    baseUrl?: string; 
    model: string 
  };
  channels: {
    whatsapp?: { 
      active: boolean; 
      channelId: string; 
      phoneNumberId: string; 
      verifyToken: string; 
      appSecret: string; 
      accessToken: string 
    };
    telegram?: { 
      active: boolean; 
      channelId: string; 
      botToken: string 
    };
    webchat?: { 
      active: boolean; 
      channelId: string; 
      publicSlug: string 
    };
  };
  flow: { defaultFlowId: string }; // debe estar 'live'
  status: 'draft'|'live';
};

import { Circuit } from './cb';

export type Msg = { role: 'system' | 'user' | 'assistant'; content: string };

export interface LLM {
  chat(messages: Msg[], opts?: { model?: string; temperature?: number; stream?: boolean }): Promise<string>;
}

// Circuit breakers por provider
const circuits = {
  openai: new Circuit(),
  gemini: new Circuit(),
  anthropic: new Circuit()
};

export function getLLM(p: { provider: 'openai' | 'gemini' | 'anthropic', apiKey: string, baseUrl?: string, model: string }): LLM {
  const circuit = circuits[p.provider];
  
  // Para desarrollo, usamos respuestas mock si no hay API key válida
  if (!p.apiKey || p.apiKey === '') {
    return {
      async chat(messages, opts) {
        const lastMessage = messages[messages.length - 1]?.content || '';
        
        // Respuestas mock inteligentes basadas en el contexto
        if (lastMessage.toLowerCase().includes('hola') || lastMessage.toLowerCase().includes('hello')) {
          return '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?';
        }
        
        if (lastMessage.toLowerCase().includes('cómo estás') || lastMessage.toLowerCase().includes('how are you')) {
          return '¡Muy bien, gracias por preguntar! Estoy aquí para ayudarte con cualquier consulta que tengas.';
        }
        
        if (lastMessage.toLowerCase().includes('ayuda') || lastMessage.toLowerCase().includes('help')) {
          return 'Por supuesto, estoy aquí para ayudarte. Puedo responder preguntas, proporcionar información y asistirte en diversas tareas. ¿Qué necesitas específicamente?';
        }
        
        // Respuesta genérica inteligente
        return `Entiendo tu mensaje: "${lastMessage}". Como asistente virtual, estoy aquí para ayudarte. ¿Podrías ser más específico sobre lo que necesitas?`;
      }
    };
  }

  switch (p.provider) {
    case 'openai':
      return {
        async chat(messages, opts = {}) {
          if (circuit.shouldBlock()) {
            throw new Error(`Circuit breaker abierto para OpenAI. Reintentar en 30 segundos.`);
          }

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(p.baseUrl || 'https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${p.apiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: opts.model || p.model,
                messages: messages.map(m => ({ role: m.role, content: m.content })),
                temperature: opts.temperature || 0.7,
                max_tokens: 1000
              }),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const error = await response.json();
              throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
            }

            const data = await response.json();
            circuit.onOk();
            return data.choices[0]?.message?.content || 'No se pudo generar una respuesta.';

          } catch (error) {
            circuit.onFail();
            
            // Si es un timeout, intentar con fallback
            if (error.name === 'AbortError') {
              const fallbackModel = process.env.OPENAI_DEFAULT_MODEL;
              if (fallbackModel && fallbackModel !== p.model) {
                console.log(`[LLM] Timeout con ${p.model}, intentando con fallback ${fallbackModel}`);
                return getLLM({ ...p, model: fallbackModel }).chat(messages, opts);
              }
            }
            
            throw error;
          }
        }
      };

    case 'gemini':
      return {
        async chat(messages, opts = {}) {
          if (circuit.shouldBlock()) {
            throw new Error(`Circuit breaker abierto para Gemini. Reintentar en 30 segundos.`);
          }

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${p.model}:generateContent?key=${p.apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: messages.map(m => ({
                  role: m.role === 'assistant' ? 'model' : m.role,
                  parts: [{ text: m.content }]
                }))
              }),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const error = await response.json();
              throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
            }

            const data = await response.json();
            circuit.onOk();
            return data.candidates[0]?.content?.parts[0]?.text || 'No se pudo generar una respuesta.';

          } catch (error) {
            circuit.onFail();
            throw error;
          }
        }
      };

    case 'anthropic':
      return {
        async chat(messages, opts = {}) {
          if (circuit.shouldBlock()) {
            throw new Error(`Circuit breaker abierto para Anthropic. Reintentar en 30 segundos.`);
          }

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'x-api-key': p.apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: opts.model || p.model,
                messages: messages.map(m => ({ role: m.role, content: m.content })),
                max_tokens: 1000
              }),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const error = await response.json();
              throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
            }

            const data = await response.json();
            circuit.onOk();
            return data.content[0]?.text || 'No se pudo generar una respuesta.';

          } catch (error) {
            circuit.onFail();
            throw error;
          }
        }
      };

    default:
      throw new Error(`Provider no implementado: ${p.provider}`);
  }
}

// Función para verificar conectividad de un provider
export async function pingProvider(provider: 'openai' | 'gemini' | 'anthropic', apiKey: string, baseUrl?: string): Promise<boolean> {
  try {
    const llm = getLLM({ provider, apiKey, baseUrl, model: 'gpt-4o-mini' });
    await llm.chat([{ role: 'user', content: 'ping' }]);
    return true;
  } catch (error) {
    console.error(`[LLM] Error pinging ${provider}:`, error);
    return false;
  }
}

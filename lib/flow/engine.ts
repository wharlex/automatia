import { getLLM } from '@/lib/llm/index';

export interface FlowNode {
  id: string;
  type: 'input' | 'llm' | 'regex_router' | 'menu_options' | 'http_request' | 'delay' | 'end';
  next?: string;
  prompt?: string;
  text?: string;
  pattern?: string;
  options?: { text: string; next: string }[];
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
  maxSize?: number;
  delay?: number;
}

export interface Flow {
  id: string;
  name: string;
  entryNodeId: string;
  nodes: Record<string, FlowNode>;
  status: string;
}

export interface FlowContext {
  history: { role: 'user' | 'assistant' | 'system'; content: string }[];
  providerCfg: {
    provider: string;
    apiKey: string;
    baseUrl?: string;
    model: string;
  };
  variables?: Record<string, any>;
}

export async function runFlow({ flow, context }: { flow: Flow; context: FlowContext }): Promise<string> {
  if (flow.status !== 'live') {
    throw new Error('Flow no está activo');
  }

  let currentNodeId = flow.entryNodeId;
  let result = '';
  let iterations = 0;
  const maxIterations = 50; // Prevenir loops infinitos

  try {
    while (currentNodeId && iterations < maxIterations) {
      iterations++;
      const node = flow.nodes[currentNodeId];
      
      if (!node) {
        throw new Error(`Nodo no encontrado: ${currentNodeId}`);
      }

      switch (node.type) {
        case 'input':
          // Nodo de entrada - no hace nada, solo pasa al siguiente
          result = 'Procesando entrada...';
          break;

        case 'llm':
          if (!node.prompt) {
            throw new Error(`Nodo LLM ${node.id} no tiene prompt configurado`);
          }

          try {
            const llm = getLLM({
              provider: context.providerCfg.provider as any,
              apiKey: context.providerCfg.apiKey,
              baseUrl: context.providerCfg.baseUrl,
              model: context.providerCfg.model
            });

            // Construir mensajes con contexto
            const messages = [
              { role: 'system' as const, content: node.prompt },
              ...context.history.slice(-5) // Últimos 5 mensajes para contexto
            ];

            result = await llm.chat(messages, { model: context.providerCfg.model });
          } catch (error) {
            console.error(`[Flow Engine] Error en nodo LLM ${node.id}:`, error);
            result = 'Lo siento, hubo un error procesando tu mensaje.';
          }
          break;

        case 'regex_router':
          if (!node.pattern || !node.next) {
            throw new Error(`Nodo regex_router ${node.id} mal configurado`);
          }

          const regex = new RegExp(node.pattern, 'i');
          const lastMessage = context.history[context.history.length - 1]?.content || '';
          
          if (regex.test(lastMessage)) {
            currentNodeId = node.next;
            continue; // Saltar al siguiente nodo
          } else {
            result = 'No pude entender tu mensaje. ¿Podrías reformularlo?';
          }
          break;

        case 'menu_options':
          if (!node.options || node.options.length === 0) {
            throw new Error(`Nodo menu_options ${node.id} no tiene opciones configuradas`);
          }

          result = 'Opciones disponibles:\n' + 
            node.options.map((opt, i) => `${i + 1}. ${opt.text}`).join('\n');
          break;

        case 'http_request':
          if (!node.url) {
            throw new Error(`Nodo http_request ${node.id} no tiene URL configurada`);
          }

          try {
            // Validar URL para prevenir SSRF (comentado por compatibilidad)
            // await assertSafeUrl(node.url);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), node.timeout || 8000);

            const response = await fetch(node.url, {
              method: node.method || 'GET',
              headers: node.headers || {},
              body: node.body,
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const responseText = await response.text();
            
            // Verificar tamaño máximo
            if (node.maxSize && responseText.length > node.maxSize) {
              throw new Error(`Respuesta demasiado grande: ${responseText.length} > ${node.maxSize}`);
            }

            result = `Respuesta de ${node.url}: ${responseText}`;
            
            // Guardar en contexto para uso posterior
            if (context.variables) {
              context.variables.http = { last: responseText, status: response.status };
            }
          } catch (error) {
            console.error(`[Flow Engine] Error en nodo http_request ${node.id}:`, error);
            result = `Error en la petición HTTP: ${error.message}`;
          }
          break;

        case 'delay':
          if (node.delay) {
            await new Promise(resolve => setTimeout(resolve, node.delay));
            result = 'Procesando...';
          }
          break;

        case 'end':
          // Nodo final - terminar el flujo
          return result || 'Flujo completado.';

        default:
          throw new Error(`Tipo de nodo no soportado: ${node.type}`);
      }

      // Mover al siguiente nodo
      currentNodeId = node.next;
    }

    if (iterations >= maxIterations) {
      console.warn(`[Flow Engine] Máximo de iteraciones alcanzado en flow ${flow.id}`);
      return result || 'Flujo completado (máximo de iteraciones alcanzado).';
    }

    return result;

  } catch (error) {
    console.error(`[Flow Engine] Error ejecutando flow ${flow.id}:`, error);
    throw new Error(`Error en el motor de flujos: ${error.message}`);
  }
}

// Función para validar un flow
export function validateFlow(flow: Flow): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Verificar que existe el nodo de entrada
  if (!flow.entryNodeId) {
    errors.push('Flow no tiene nodo de entrada definido');
  }

  // Verificar que todos los nodos referenciados existen
  const nodeIds = Object.keys(flow.nodes);
  const referencedNodes = new Set<string>();

  for (const node of Object.values(flow.nodes)) {
    if (node.next) {
      referencedNodes.add(node.next);
    }
  }

  for (const referencedId of referencedNodes) {
    if (!nodeIds.includes(referencedId)) {
      errors.push(`Nodo referenciado no existe: ${referencedId}`);
    }
  }

  // Verificar que no hay ciclos infinitos (simplificado)
  const visited = new Set<string>();
  let currentNodeId = flow.entryNodeId;
  let iterations = 0;

  while (currentNodeId && iterations < 100) {
    if (visited.has(currentNodeId)) {
      errors.push(`Ciclo detectado en nodo: ${currentNodeId}`);
      break;
    }

    visited.add(currentNodeId);
    const node = flow.nodes[currentNodeId];
    
    if (!node) {
      errors.push(`Nodo no encontrado: ${currentNodeId}`);
      break;
    }

    currentNodeId = node.next;
    iterations++;
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

import { LLMProvider, LLMMessage } from '../providers/llm'
import { LLMProviderFactory } from '../providers/llm'

export interface FlowNode {
  id: string
  type: 'input' | 'llm' | 'regex_router' | 'menu_options' | 'http_request' | 'delay' | 'end'
  config: any
  next?: string
  children?: string[]
}

export interface FlowDefinition {
  nodes: { [key: string]: FlowNode }
  entryNodeId: string
  variables?: { [key: string]: any }
}

export interface FlowContext {
  messages: LLMMessage[]
  variables: { [key: string]: any }
  currentNodeId: string
  visitedNodes: Set<string>
}

export class FlowEngine {
  private providers: Map<string, LLMProvider> = new Map()
  private defaultProvider?: LLMProvider

  constructor(defaultProvider?: LLMProvider) {
    this.defaultProvider = defaultProvider
  }

  /**
   * Agrega un proveedor LLM al motor
   */
  addProvider(id: string, provider: LLMProvider): void {
    this.providers.set(id, provider)
  }

  /**
   * Ejecuta un flujo completo
   */
  async executeFlow(
    flow: FlowDefinition,
    input: string,
    context?: Partial<FlowContext>
  ): Promise<{ output: string; context: FlowContext }> {
    const flowContext: FlowContext = {
      messages: [
        { role: 'user', content: input }
      ],
      variables: flow.variables || {},
      currentNodeId: flow.entryNodeId,
      visitedNodes: new Set()
    }

    // Aplicar contexto existente si se proporciona
    if (context) {
      Object.assign(flowContext, context)
    }

    let currentNode = flow.nodes[flowContext.currentNodeId]
    let output = ''

    while (currentNode && !flowContext.visitedNodes.has(currentNode.id)) {
      flowContext.visitedNodes.add(currentNode.id)
      
      try {
        const result = await this.executeNode(currentNode, flowContext, flow)
        
        if (result.output) {
          output = result.output
        }
        
        if (result.context) {
          Object.assign(flowContext, result.context)
        }
        
        // Si es un nodo final, terminar
        if (currentNode.type === 'end' || !result.nextNodeId) {
          break
        }
        
        // Ir al siguiente nodo
        flowContext.currentNodeId = result.nextNodeId
        currentNode = flow.nodes[result.nextNodeId]
        
      } catch (error) {
        console.error(`Error executing node ${currentNode.id}:`, error)
        output = 'Lo siento, ocurrió un error procesando tu mensaje.'
        break
      }
    }

    return { output, context: flowContext }
  }

  /**
   * Ejecuta un nodo individual
   */
  private async executeNode(
    node: FlowNode,
    context: FlowContext,
    flow: FlowDefinition
  ): Promise<{ output?: string; context?: Partial<FlowContext>; nextNodeId?: string }> {
    switch (node.type) {
      case 'input':
        return this.executeInputNode(node, context)
      
      case 'llm':
        return await this.executeLLMNode(node, context)
      
      case 'regex_router':
        return this.executeRegexRouterNode(node, context, flow)
      
      case 'menu_options':
        return this.executeMenuOptionsNode(node, context, flow)
      
      case 'http_request':
        return await this.executeHttpRequestNode(node, context)
      
      case 'delay':
        return this.executeDelayNode(node, context)
      
      case 'end':
        return this.executeEndNode(node, context)
      
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  }

  private executeInputNode(node: FlowNode, context: FlowContext) {
    // El nodo de entrada solo procesa el input inicial
    return { nextNodeId: node.next }
  }

  private async executeLLMNode(node: FlowNode, context: FlowContext) {
    const config = node.config || {}
    const providerId = config.provider || 'default'
    
    let provider = this.providers.get(providerId) || this.defaultProvider
    if (!provider) {
      throw new Error(`No LLM provider available for node ${node.id}`)
    }

    // Construir el prompt
    const systemPrompt = config.systemPrompt || 'Eres un asistente útil y directo. Responde en español.'
    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt },
      ...context.messages.slice(-5) // Últimos 5 mensajes para contexto
    ]

    try {
      const response = await provider.chat(messages, {
        model: config.model,
        temperature: config.temperature || 0.7
      })

      // Agregar la respuesta al contexto
      context.messages.push({ role: 'assistant', content: response })

      return {
        output: response,
        context: { messages: context.messages },
        nextNodeId: node.next
      }
    } catch (error) {
      console.error(`LLM execution error in node ${node.id}:`, error)
      throw new Error(`Failed to get LLM response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private executeRegexRouterNode(node: FlowNode, context: FlowContext, flow: FlowDefinition) {
    const config = node.config || {}
    const patterns = config.patterns || []
    const userInput = context.messages[context.messages.length - 1]?.content || ''

    for (const pattern of patterns) {
      const regex = new RegExp(pattern.regex, pattern.flags || 'i')
      if (regex.test(userInput)) {
        return { nextNodeId: pattern.nextNodeId }
      }
    }

    // Si no hay coincidencias, usar el nodo por defecto
    return { nextNodeId: config.defaultNext || node.next }
  }

  private executeMenuOptionsNode(node: FlowNode, context: FlowContext, flow: FlowDefinition) {
    const config = node.config || {}
    const options = config.options || []
    const userInput = context.messages[context.messages.length - 1]?.content || ''

    // Buscar opción que coincida con el input del usuario
    for (const option of options) {
      if (userInput.toLowerCase().includes(option.text.toLowerCase()) || 
          userInput === option.value) {
        return { nextNodeId: option.nextNodeId }
      }
    }

    // Si no hay coincidencias, usar el nodo por defecto
    return { nextNodeId: config.defaultNext || node.next }
  }

  private async executeHttpRequestNode(node: FlowNode, context: FlowContext) {
    const config = node.config || {}
    const { url, method = 'GET', headers = {}, body } = config

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      })

      if (!response.ok) {
        throw new Error(`HTTP request failed: ${response.status} ${response.statusText}`)
      }

      const responseData = await response.json()
      
      // Guardar la respuesta en el contexto
      context.variables[`http_response_${node.id}`] = responseData

      return {
        context: { variables: context.variables },
        nextNodeId: node.next
      }
    } catch (error) {
      console.error(`HTTP request error in node ${node.id}:`, error)
      throw new Error(`HTTP request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private executeDelayNode(node: FlowNode, context: FlowContext) {
    const config = node.config || {}
    const delayMs = config.delayMs || 1000

    // En una implementación real, esto se manejaría con colas de trabajo
    // Por ahora, simulamos el delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          nextNodeId: node.next
        })
      }, delayMs)
    })
  }

  private executeEndNode(node: FlowNode, context: FlowContext) {
    const config = node.config || {}
    return {
      output: config.finalMessage || 'Conversación finalizada',
      context: { variables: context.variables }
    }
  }

  /**
   * Valida que un flujo sea correcto
   */
  validateFlow(flow: FlowDefinition): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Verificar que existe el nodo de entrada
    if (!flow.entryNodeId) {
      errors.push('Missing entry node ID')
    }

    // Verificar que todos los nodos referenciados existen
    const nodeIds = Object.keys(flow.nodes)
    if (!nodeIds.includes(flow.entryNodeId)) {
      errors.push(`Entry node ${flow.entryNodeId} not found`)
    }

    // Verificar que cada nodo tiene las propiedades requeridas
    for (const [nodeId, node] of Object.entries(flow.nodes)) {
      if (!node.type) {
        errors.push(`Node ${nodeId} missing type`)
      }

      if (node.type === 'llm' && !node.config?.provider) {
        errors.push(`LLM node ${nodeId} missing provider configuration`)
      }

      if (node.type === 'regex_router' && (!node.config?.patterns || !Array.isArray(node.config.patterns))) {
        errors.push(`Regex router node ${nodeId} missing patterns configuration`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}


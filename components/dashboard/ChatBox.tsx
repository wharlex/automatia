"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  MessageSquare, 
  Bot, 
  User,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  StopCircle
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useChatSSE } from "../hooks/useChatSSE"
import { nanoid } from "nanoid"

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    flowId?: string
    stepId?: string
    knowledgeUsed?: string[]
    aiProvider?: string
    model?: string
    tokensUsed?: number
  }
}

interface ChatBoxProps {
  className?: string
  onSendMessage?: (message: string) => Promise<void>
  initialMessages?: Message[]
  placeholder?: string
  disabled?: boolean
  workspaceId?: string
  botId?: string
}

export function ChatBox({ 
  className, 
  onSendMessage, 
  initialMessages = [], 
  placeholder = "Escribe tu mensaje...",
  disabled = false,
  workspaceId,
  botId
}: ChatBoxProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem("chat.sid")
    if (saved) return saved
    const id = nanoid()
    localStorage.setItem("chat.sid", id)
    return id
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // SSE Hook
  const { meta, buffer, loading, error, start, cancel, reset } = useChatSSE()

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`automatia_chat_${sessionId}`)
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }
  }, [sessionId])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`automatia_chat_${sessionId}`, JSON.stringify(messages))
    }
  }, [messages, sessionId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages, buffer])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle SSE buffer updates
  useEffect(() => {
    if (buffer && loading) {
      // Update the last assistant message with streaming content
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = buffer
        }
        return newMessages
      })
    }
  }, [buffer, loading])

  // Handle SSE completion
  useEffect(() => {
    if (!loading && buffer && meta) {
      // Finalize the last assistant message
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.metadata = {
            flowId: meta.flowId,
            stepId: meta.stepId,
            knowledgeUsed: meta.datasources,
            aiProvider: meta.provider,
            model: meta.model,
            tokensUsed: meta.tokens?.total
          }
        }
        return newMessages
      })
      
      // Reset SSE state
      reset()
    }
  }, [loading, buffer, meta, reset])

  // Handle SSE errors
  useEffect(() => {
    if (error) {
      toast.error("Error en el chat", {
        description: error
      })
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "Lo siento, hubo un error procesando tu mensaje. Por favor, intenta nuevamente.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      
      reset()
    }
  }, [error, reset])

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading || disabled || !botId) return

    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")

    try {
      if (onSendMessage) {
        await onSendMessage(userMessage.content)
      } else {
        // Add assistant message placeholder
        const assistantMessage: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: '',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])

        // Start SSE stream
        const clientMessageId = nanoid()
        start({
          body: {
            botId,
            sessionId,
            clientMessageId,
            text: userMessage.content,
            workspaceId
          }
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error("Error al enviar el mensaje", {
        description: "Intenta nuevamente"
      })
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "Lo siento, hubo un error procesando tu mensaje. Por favor, intenta nuevamente.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const copyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(messageId)
      toast.success("Mensaje copiado al portapapeles")
      
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error("Error al copiar el mensaje")
    }
  }

  const resetChat = () => {
    if (confirm("¿Estás seguro de que quieres reiniciar la conversación? Se perderá todo el historial.")) {
      setMessages([])
      localStorage.removeItem(`automatia_chat_${sessionId}`)
      reset()
      toast.info("Chat reiniciado", {
        description: "Se ha limpiado el historial de conversación"
      })
    }
  }

  const exportChat = () => {
    const chatData = {
      sessionId,
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        metadata: msg.metadata
      }))
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `automatia_chat_${sessionId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Chat exportado", {
      description: "Se ha descargado el historial de conversación"
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    })
  }

  const getMessageRoleLabel = (role: 'user' | 'assistant') => {
    return role === 'user' ? 'Tú' : 'Automatía'
  }

  const getMessageRoleIcon = (role: 'user' | 'assistant') => {
    return role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />
  }

  const getConnectionStatus = () => {
    if (!botId) return { status: 'disconnected', text: 'Bot no configurado' }
    if (error) return { status: 'error', text: 'Error de conexión' }
    if (loading) return { status: 'connected', text: 'Conectado' }
    return { status: 'connected', text: 'Conectado' }
  }

  const connectionStatus = getConnectionStatus()

  return (
    <Card className={cn("flex flex-col h-full bg-automatia-teal border-automatia-gold/20", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-automatia-gold/20">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-3 h-3 rounded-full",
            connectionStatus.status === 'connected' ? "bg-green-500 animate-pulse" :
            connectionStatus.status === 'error' ? "bg-red-500" : "bg-yellow-500"
          )}></div>
          <h3 className="text-lg font-semibold text-automatia-white">Chat en Vivo</h3>
          <Badge 
            className={cn(
              "border-automatia-gold/20 text-xs",
              connectionStatus.status === 'connected' 
                ? "text-green-400 border-green-400/20" 
                : connectionStatus.status === 'error'
                ? "text-red-400 border-red-400/20"
                : "text-yellow-400 border-yellow-400/20"
            )}
          >
            {connectionStatus.text}
          </Badge>
          <Badge className="border-automatia-gold/20 text-automatia-gold text-xs">
            {messages.length} mensajes
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {loading && (
            <Button
              onClick={cancel}
              className="border-red-600 text-red-400 hover:bg-red-600/10 text-xs"
            >
              <StopCircle className="w-3 h-3 mr-1" />
              Detener
            </Button>
          )}
          
          <Button
            onClick={exportChat}
            disabled={messages.length === 0}
            className="border-automatia-gold/20 text-automatia-gold hover:bg-automatia-gold/10 text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            Exportar
          </Button>
          
          <Button
            onClick={resetChat}
            disabled={messages.length === 0}
            className="border-automatia-gold/20 text-automatia-gold hover:bg-automatia-gold/10 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reiniciar
          </Button>
        </div>
      </div>

      {/* Connection Warning */}
      {connectionStatus.status !== 'connected' && (
        <div className="p-3 mx-4 mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>
              {connectionStatus.status === 'disconnected' 
                ? 'El bot no está configurado. Configura un bot para comenzar a chatear.'
                : connectionStatus.status === 'error'
                ? 'Error de conexión. Verifica tu configuración.'
                : 'Verificando conexión...'
              }
            </span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-automatia-white mb-2">
                ¡Inicia una conversación!
              </h4>
              <p className="text-gray-400 mb-4">
                {connectionStatus.status === 'connected' 
                  ? 'Escribe tu primera pregunta y nuestro asistente de IA te ayudará'
                  : 'Configura tu bot primero para comenzar a chatear'
                }
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-automatia-gold">
                <Sparkles className="w-4 h-4" />
                {connectionStatus.status === 'connected' 
                  ? 'Asistente inteligente disponible 24/7'
                  : 'Configuración requerida'
                }
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message.id} className="flex gap-3">
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === 'user' 
                    ? "bg-automatia-gold text-automatia-black" 
                    : "bg-automatia-gold-bright text-automatia-black"
                )}>
                  {getMessageRoleIcon(message.role)}
                </div>

                {/* Message Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-automatia-white">
                      {getMessageRoleLabel(message.role)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    {message.role === 'assistant' && message.metadata && (
                      <div className="flex items-center gap-1">
                        {message.metadata.aiProvider && (
                          <Badge className="text-xs border-gray-600 text-gray-300">
                            {message.metadata.aiProvider}
                          </Badge>
                        )}
                        {message.metadata.model && (
                          <Badge className="text-xs border-gray-600 text-gray-300">
                            {message.metadata.model}
                          </Badge>
                        )}
                      </div>
                    )}
                    {message.role === 'assistant' && (
                      <Button
                        onClick={() => copyMessage(message.id, message.content)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-automatia-gold"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </div>
                  
                  <div className={cn(
                    "p-3 rounded-lg text-sm",
                    message.role === 'user'
                      ? "bg-automatia-gold/10 border border-automatia-gold/20 text-automatia-white"
                      : "bg-automatia-black/50 border border-automatia-gold/10 text-automatia-white"
                  )}>
                    {message.content || (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-automatia-gold" />
                        <span className="text-gray-400">Escribiendo...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Metadata */}
                  {message.role === 'assistant' && message.metadata && (
                    <div className="text-xs text-gray-500 space-y-1">
                      {message.metadata.knowledgeUsed && message.metadata.knowledgeUsed.length > 0 && (
                        <div>
                          <span className="text-gray-400">Conocimiento usado: </span>
                          {message.metadata.knowledgeUsed.join(', ')}
                        </div>
                      )}
                      {message.metadata.tokensUsed && (
                        <div>
                          <span className="text-gray-400">Tokens: </span>
                          {message.metadata.tokensUsed}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-automatia-gold/20">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={connectionStatus.status === 'connected' ? placeholder : 'Configura tu bot primero...'}
            disabled={disabled || loading || connectionStatus.status !== 'connected'}
            className="flex-1 bg-automatia-black border-automatia-gold/20 text-automatia-white placeholder:text-gray-500 focus:border-automatia-gold focus:ring-automatia-gold/20"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading || disabled || connectionStatus.status !== 'connected'}
            className="bg-gradient-to-r from-automatia-gold to-automatia-gold-bright text-automatia-black hover:from-automatia-gold-bright hover:to-automatia-gold font-semibold px-6"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>
            {connectionStatus.status === 'connected' 
              ? 'Presiona Enter para enviar'
              : 'Bot no configurado'
            }
          </span>
          <span>ID de sesión: {sessionId.slice(-8)}</span>
        </div>
      </div>
    </Card>
  )
}

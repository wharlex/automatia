"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bot, 
  User, 
  Send, 
  Copy, 
  RotateCcw, 
  Download, 
  Zap,
  Brain,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
  Star,
  ThumbsUp,
  ThumbsDown
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  typing?: boolean
  sentiment?: 'positive' | 'neutral' | 'negative'
  confidence?: number
  tokens?: number
  responseTime?: number
  liked?: boolean
}

interface ChatBotProProps {
  className?: string
  onSendMessage?: (message: string) => Promise<string>
  initialMessages?: Message[]
  placeholder?: string
  disabled?: boolean
  botPersonality?: 'professional' | 'friendly' | 'creative' | 'technical' | 'sales'
  enableVoice?: boolean
  enableAnalytics?: boolean
}

const personalityConfigs = {
  professional: {
    name: "Automatía Pro",
    avatar: "🤖",
    color: "from-blue-500 to-blue-700",
    description: "Asistente profesional y eficiente"
  },
  friendly: {
    name: "Automatía Amigo",
    avatar: "😊",
    color: "from-green-500 to-green-700",
    description: "Asistente amigable y cercano"
  },
  creative: {
    name: "Automatía Creative",
    avatar: "🎨",
    color: "from-purple-500 to-purple-700",
    description: "Asistente creativo e innovador"
  },
  technical: {
    name: "Automatía Tech",
    avatar: "⚡",
    color: "from-orange-500 to-orange-700",
    description: "Asistente técnico especializado"
  },
  sales: {
    name: "Automatía Sales",
    avatar: "💼",
    color: "from-red-500 to-red-700",
    description: "Asistente de ventas persuasivo"
  }
}

export function ChatBotPro({
  className,
  onSendMessage,
  initialMessages = [],
  placeholder = "Escribe tu mensaje...",
  disabled = false,
  botPersonality = 'professional',
  enableVoice = true,
  enableAnalytics = true
}: ChatBotProProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}`)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [analytics, setAnalytics] = useState({
    totalMessages: 0,
    avgResponseTime: 0,
    satisfaction: 0,
    conversationScore: 0
  })
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const personality = personalityConfigs[botPersonality]

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatbot_messages_${sessionId}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [sessionId])

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem(`chatbot_messages_${sessionId}`, JSON.stringify(messages))
    updateAnalytics()
  }, [messages, sessionId])

  const updateAnalytics = () => {
    if (!enableAnalytics) return
    
    const userMessages = messages.filter(m => m.role === 'user')
    const botMessages = messages.filter(m => m.role === 'assistant')
    
    const avgResponseTime = botMessages.reduce((acc, msg) => acc + (msg.responseTime || 0), 0) / botMessages.length || 0
    const satisfaction = messages.filter(m => m.liked === true).length / messages.length * 100 || 0
    const conversationScore = Math.min(100, (messages.length * 10) + satisfaction)
    
    setAnalytics({
      totalMessages: messages.length,
      avgResponseTime,
      satisfaction,
      conversationScore
    })
  }

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulated AI response with personality
    const responses = {
      professional: [
        "Entiendo perfectamente su consulta. Permítame proporcionarle una respuesta detallada y precisa.",
        "Basándome en la información proporcionada, puedo confirmar que...",
        "Excelente pregunta. La solución más eficiente sería..."
      ],
      friendly: [
        "¡Hola! Me encanta que me hayas preguntado eso 😊",
        "¡Qué buena pregunta! Te ayudo con mucho gusto...",
        "¡Perfecto! Déjame contarte todo lo que necesitas saber..."
      ],
      creative: [
        "¡Wow! Esa es una pregunta que despierta mi creatividad 🎨",
        "Imagínate esto: podríamos abordar tu consulta de manera innovadora...",
        "¡Me encanta pensar fuera de la caja! Aquí tienes una perspectiva única..."
      ],
      technical: [
        "Analizando los parámetros técnicos de tu consulta...",
        "Desde el punto de vista técnico, la implementación óptima sería...",
        "Procesando datos... Aquí tienes la solución técnica más robusta..."
      ],
      sales: [
        "¡Excelente! Esta es exactamente la oportunidad que estábamos esperando.",
        "Permíteme mostrarte cómo esto puede transformar completamente tu negocio...",
        "¡Fantástico! Tengo la solución perfecta que va a encantarte..."
      ]
    }

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000))
    const personalityResponses = responses[botPersonality]
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || disabled || isTyping) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date(),
      sentiment: 'neutral'
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      typing: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const startTime = Date.now()
      const response = onSendMessage 
        ? await onSendMessage(userMessage.content)
        : await simulateAIResponse(userMessage.content)
      
      const responseTime = Date.now() - startTime

      // Remove typing indicator and add real response
      setMessages(prev => prev.filter(m => m.id !== 'typing'))
      
      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        sentiment: 'positive',
        confidence: 0.95,
        tokens: response.length,
        responseTime
      }

      setMessages(prev => [...prev, assistantMessage])

      // Text-to-speech if enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response)
        utterance.lang = 'es-ES'
        speechSynthesis.speak(utterance)
      }

    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== 'typing'))
      toast.error("Error al procesar el mensaje. Intenta nuevamente.")
    } finally {
      setIsTyping(false)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Mensaje copiado al portapapeles")
  }

  const likeMessage = (messageId: string, liked: boolean) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, liked } : msg
      )
    )
    toast.success(liked ? "¡Gracias por tu feedback!" : "Feedback registrado")
  }

  const resetChat = () => {
    setMessages([])
    localStorage.removeItem(`chatbot_messages_${sessionId}`)
    toast.success("Conversación reiniciada")
  }

  const exportChat = () => {
    const chatData = {
      sessionId,
      personality: botPersonality,
      messages,
      analytics,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `automatia-chat-${sessionId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Conversación exportada")
  }

  return (
    <Card className={cn("h-[600px] flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-lg", personality.color)}>
              {personality.avatar}
            </div>
            <div>
              <CardTitle className="text-lg">{personality.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{personality.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {enableAnalytics && (
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                {Math.round(analytics.conversationScore)}
              </Badge>
            )}
            
            <div className="flex gap-1">
              {enableVoice && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="h-8 w-8 p-0"
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={exportChat}
                className="h-8 w-8 p-0"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetChat}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {enableAnalytics && messages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{analytics.totalMessages}</div>
              <div className="text-xs text-muted-foreground">Mensajes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{Math.round(analytics.avgResponseTime)}ms</div>
              <div className="text-xs text-muted-foreground">Respuesta</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{Math.round(analytics.satisfaction)}%</div>
              <div className="text-xs text-muted-foreground">Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{Math.round(analytics.conversationScore)}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className={cn("w-16 h-16 rounded-full bg-gradient-to-r mx-auto mb-4 flex items-center justify-center text-white text-2xl", personality.color)}>
                  {personality.avatar}
                </div>
                <h3 className="font-semibold mb-2">¡Hola! Soy {personality.name}</h3>
                <p className="text-muted-foreground text-sm">{personality.description}</p>
                <p className="text-muted-foreground text-sm mt-2">¿En qué puedo ayudarte hoy?</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 group",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className={cn("w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-sm flex-shrink-0", personality.color)}>
                    {message.typing ? <Sparkles className="w-4 h-4 animate-pulse" /> : personality.avatar}
                  </div>
                )}

                <div className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 relative",
                  message.role === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}>
                  {message.typing ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm">Escribiendo...</span>
                    </div>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                        <div className="flex items-center gap-2 text-xs opacity-60">
                          <Clock className="w-3 h-3" />
                          {message.timestamp.toLocaleTimeString()}
                          {message.responseTime && (
                            <>
                              <span>•</span>
                              <span>{message.responseTime}ms</span>
                            </>
                          )}
                          {message.confidence && (
                            <>
                              <span>•</span>
                              <span>{Math.round(message.confidence * 100)}%</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          
                          {message.role === 'assistant' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => likeMessage(message.id, true)}
                                className={cn("h-6 w-6 p-0", message.liked === true && "text-green-600")}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => likeMessage(message.id, false)}
                                className={cn("h-6 w-6 p-0", message.liked === false && "text-red-600")}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isTyping}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={disabled || isTyping || !inputValue.trim()}
            size="sm"
            className="px-3"
          >
            {isTyping ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


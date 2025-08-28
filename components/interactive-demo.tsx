"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Send, User, Sparkles, MessageCircle, Zap, Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const demoResponses = [
  "¡Hola! Soy el asistente virtual de Automatía. ¿En qué puedo ayudarte hoy?",
  "Perfecto, entiendo tu consulta. Te puedo ayudar con información sobre nuestros planes, configuración del chatbot, o cualquier duda técnica.",
  "Excelente pregunta. Nuestros chatbots pueden integrarse con WhatsApp Business, Instagram, Facebook Messenger y tu sitio web.",
  "El tiempo de implementación es de solo 48 horas. Nuestro equipo se encarga de toda la configuración y entrenamiento.",
  "¡Por supuesto! Te puedo conectar con nuestro equipo de ventas para una demo personalizada. ¿Te parece bien?"
]

export function InteractiveDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "¡Hola! Soy el asistente virtual de Automatía. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response = demoResponses[currentResponseIndex % demoResponses.length]
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
      setCurrentResponseIndex(prev => prev + 1)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    "¿Cuáles son tus planes?",
    "¿Cómo funciona la integración?",
    "¿Cuánto tiempo toma implementar?",
    "¿Puedo ver una demo?"
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-10 h-10 text-[#0A1C2F]" />
          </div>
          <h2 className="text-3xl font-bold text-[#EAEAEA] mb-3">
            Prueba Nuestro Chatbot
          </h2>
          <p className="text-lg text-[#EAEAEA]/80 max-w-2xl mx-auto">
            Experimenta la potencia de la IA conversacional. Haz preguntas y descubre cómo Automatía puede transformar tu atención al cliente.
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Demo del Chat */}
        <div className="lg:col-span-2">
          <Card className="bg-[#0f0f0f]/50 border-[#C5B358]/20 h-[500px] flex flex-col">
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Header del Chat */}
              <div className="bg-gradient-to-r from-[#C5B358]/10 to-[#FFD700]/10 border-b border-[#C5B358]/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#0A1C2F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#EAEAEA]">Asistente Automatía</h3>
                    <p className="text-sm text-[#EAEAEA]/60">IA Conversacional • En línea</p>
                  </div>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F]"
                            : "bg-[#0A1C2F]/50 border border-[#C5B358]/20 text-[#EAEAEA]"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.role === "user" ? "text-[#0A1C2F]/70" : "text-[#EAEAEA]/50"
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Indicador de escritura */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#0A1C2F]/50 border border-[#C5B358]/20 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#C5B358] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#C5B358] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-[#C5B358] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-[#EAEAEA]/60">Escribiendo...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input del Chat */}
              <div className="border-t border-[#C5B358]/20 p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 bg-[#0A1C2F]/50 border-[#C5B358]/30 text-[#EAEAEA] placeholder-[#EAEAEA]/50 focus:border-[#C5B358] focus:ring-[#C5B358]/20"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-[#0A1C2F] hover:from-[#FFD700] hover:to-[#C5B358] px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preguntas Sugeridas */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-[#EAEAEA] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5B358]" />
              Preguntas Sugeridas
            </h3>
            <div className="space-y-3">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => {
                    setInputValue(question)
                    setTimeout(() => handleSendMessage(), 100)
                  }}
                  className="w-full text-left p-3 rounded-xl bg-[#0A1C2F]/30 border border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 hover:border-[#C5B358]/40 transition-all duration-200"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Características Destacadas */}
          <div>
            <h3 className="text-xl font-semibold text-[#EAEAEA] mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#C5B358]" />
              Características
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A1C2F]/30 border border-[#C5B358]/20">
                <Brain className="w-5 h-5 text-[#C5B358]" />
                <span className="text-sm text-[#EAEAEA]/80">IA Avanzada GPT-4</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A1C2F]/30 border border-[#C5B358]/20">
                <MessageCircle className="w-5 h-5 text-[#C5B358]" />
                <span className="text-sm text-[#EAEAEA]/80">Multiplataforma</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A1C2F]/30 border border-[#C5B358]/20">
                <Zap className="w-5 h-5 text-[#C5B358]" />
                <span className="text-sm text-[#EAEAEA]/80">Implementación 48h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}








"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const demoScenarios = {
  restaurant: {
    name: "Restaurante Demo",
    responses: {
      hola: "¡Hola! Bienvenido a Restaurante Demo. ¿En qué puedo ayudarte hoy? Puedo ayudarte con reservas, consultar nuestro menú o responder cualquier pregunta.",
      reserva: "¡Perfecto! ¿Para cuántas personas sería la reserva y qué día te gustaría venir?",
      "4 personas sabado":
        "Excelente, para 4 personas el sábado. ¿Prefieres almuerzo o cena? Tengo disponibilidad a las 13:00, 15:00, 20:00 y 22:00.",
      "cena 20":
        "¡Perfecto! Reserva confirmada para 4 personas el sábado a las 20:00. ¿Podrías darme tu nombre y teléfono para la reserva?",
      menu: "Nuestro menú incluye: Entradas (Empanadas $800, Provoleta $1200), Principales (Bife de chorizo $3500, Salmón grillado $4200), Postres (Flan $900, Tiramisu $1100). ¿Te interesa algo en particular?",
    },
  },
  gym: {
    name: "Gimnasio Demo",
    responses: {
      hola: "¡Hola! Soy el asistente de Gimnasio Demo. ¿Cómo puedo ayudarte? Puedo informarte sobre clases, horarios, reservar tu lugar o responder consultas sobre membresías.",
      spinning:
        "¡Excelente elección! Las clases de spinning son: Lunes, Miércoles y Viernes a las 9:00 y 19:00. Martes y Jueves a las 18:30. ¿Para qué día te gustaría reservar?",
      "viernes 9":
        "Perfecto, spinning del viernes a las 9:00. Quedan 3 lugares disponibles. ¿Te reservo un lugar? Solo necesito tu nombre.",
      precios:
        "Nuestros planes son: Mensual $8000 (acceso completo), Clases sueltas $1200 c/u, Pack 10 clases $10000 (válido 2 meses). ¿Cuál te interesa más?",
    },
  },
}

export function CoreAIDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy Core AI. Selecciona un escenario para probar cómo funciono:",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [currentScenario, setCurrentScenario] = useState<keyof typeof demoScenarios | null>(null)

  const handleSendMessage = () => {
    if (!inputValue.trim() || !currentScenario) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate bot response
    setTimeout(() => {
      const scenario = demoScenarios[currentScenario]
      const lowerInput = inputValue.toLowerCase()

      let response =
        "Interesante pregunta. En un entorno real, Core AI estaría entrenado con todos los datos específicos de tu negocio para dar respuestas precisas y personalizadas."

      // Find matching response
      for (const [key, value] of Object.entries(scenario.responses)) {
        if (lowerInput.includes(key)) {
          response = value
          break
        }
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setInputValue("")
  }

  const selectScenario = (scenario: keyof typeof demoScenarios) => {
    setCurrentScenario(scenario)
    const welcomeMessage: Message = {
      id: messages.length + 1,
      text: `¡Perfecto! Ahora estás hablando con Core AI configurado para ${demoScenarios[scenario].name}. Prueba escribir: "hola", "reserva", "menu", "precios", etc.`,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, welcomeMessage])
  }

  return (
    <Card className="bg-card border-border max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          Demo Interactivo - Core AI
        </CardTitle>
        {currentScenario && <Badge variant="secondary">Modo: {demoScenarios[currentScenario].name}</Badge>}
      </CardHeader>
      <CardContent>
        {!currentScenario ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center mb-6">Selecciona un tipo de negocio para probar Core AI:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                onClick={() => selectScenario("restaurant")}
              >
                <span className="text-2xl">🍽️</span>
                <span>Restaurante</span>
                <span className="text-xs text-muted-foreground">Reservas y menú</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                onClick={() => selectScenario("gym")}
              >
                <span className="text-2xl">💪</span>
                <span>Gimnasio</span>
                <span className="text-xs text-muted-foreground">Clases y membresías</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`p-2 rounded-full ${message.sender === "user" ? "bg-primary" : "bg-secondary"}`}>
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-secondary-foreground" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentScenario(null)
                  setMessages([
                    {
                      id: 1,
                      text: "¡Hola! Soy Core AI. Selecciona un escenario para probar cómo funciono:",
                      sender: "bot",
                      timestamp: new Date(),
                    },
                  ])
                }}
              >
                Cambiar escenario
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

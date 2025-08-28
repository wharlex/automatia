"use client"

import { useState } from "react"

export const dynamic = 'force-dynamic'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, MessageSquare, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChatBotPro } from "@/components/dashboard/ChatBotPro"

export default function ChatbotDemoPage() {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [demoMode, setDemoMode] = useState<"web" | "whatsapp">("web")
  const [resetKey, setResetKey] = useState(0)

  const handleReset = () => {
    setResetKey((prev) => prev + 1)
  }

  const handleBack = () => {
    router.push("/dashboard/chatbot")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#EAEAEA] mb-2">Acceso Requerido</h2>
          <p className="text-gray-400">Iniciá sesión para probar el chatbot</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#EAEAEA] mb-2">Demo del Chatbot</h1>
            <p className="text-gray-400">Probá tu asistente de IA en tiempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar Chat
          </Button>
          <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Demo Activo
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#EAEAEA] text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C5B358]" />
                Modo de Prueba
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Button
                  variant={demoMode === "web" ? "default" : "outline"}
                  size="sm"
                  className={`w-full justify-start ${
                    demoMode === "web"
                      ? "bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black"
                      : "border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 bg-transparent"
                  }`}
                  onClick={() => setDemoMode("web")}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Web Widget
                </Button>
                <Button
                  variant={demoMode === "whatsapp" ? "default" : "outline"}
                  size="sm"
                  className={`w-full justify-start ${
                    demoMode === "whatsapp"
                      ? "bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black"
                      : "border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 bg-transparent"
                  }`}
                  onClick={() => setDemoMode("whatsapp")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#EAEAEA] text-lg">Instrucciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-400 space-y-2">
                <p>• Probá diferentes tipos de consultas</p>
                <p>• Verificá que las respuestas sean coherentes</p>
                <p>• Chequeá el tono argentino</p>
                <p>• Testea la captura de leads</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#EAEAEA] text-lg">Ejemplos de Prueba</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-400 space-y-1">
                <p className="font-medium text-[#C5B358]">Consultas básicas:</p>
                <p>• "¿Qué servicios ofrecen?"</p>
                <p>• "¿Cuáles son los precios?"</p>
                <p>• "¿Cómo puedo contactarlos?"</p>

                <p className="font-medium text-[#C5B358] mt-3">Lead capture:</p>
                <p>• "Quiero más información"</p>
                <p>• "Me interesa contratar"</p>

                <p className="font-medium text-[#C5B358] mt-3">Soporte:</p>
                <p>• "Tengo un problema"</p>
                <p>• "Necesito ayuda técnica"</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="bg-[#0A1C2F] border-[#C5B358]/20 h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#EAEAEA] text-lg flex items-center gap-2">
                {demoMode === "web" ? (
                  <>
                    <Globe className="w-5 h-5 text-blue-500" />
                    Simulación Web Widget
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    Simulación WhatsApp
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-6 pb-6">
                <div className={`${demoMode === "whatsapp" ? "max-w-sm mx-auto" : ""}`}>
                  <ChatBotPro 
                    key={resetKey}
                    botPersonality={demoMode === "whatsapp" ? "friendly" : "professional"}
                    enableVoice={true}
                    enableAnalytics={true}
                    placeholder={demoMode === "whatsapp" ? "Escribe tu mensaje..." : "Prueba tu chatbot aquí..."}
                    className="h-[500px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

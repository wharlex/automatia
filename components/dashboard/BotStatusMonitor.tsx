"use client"

import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Play,
  Square,
  RefreshCw,
  MessageSquare,
  Bot,
  Database,
  Zap,
} from "lucide-react"

interface BotStatus {
  active: boolean
  uptime: string
  activatedAt: string | null
  lastActivity: string | null
  version: string
  components: {
    llm: { configured: boolean; status: string; provider: string | null }
    whatsapp: { configured: boolean; status: string; lastWebhook: string | null }
    personality: { configured: boolean; status: string; botName: string | null }
    knowledgeBase: { configured: boolean; status: string; totalDocuments: number; totalChunks: number }
  }
  metrics: {
    messages24h: number
    totalEvents: number
    avgResponseTime: string
    successRate: string
  }
  recentEvents: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
  recentMessages: Array<{
    id: string
    from: string
    text: string
    timestamp: string
    type: string
  }>
  health: {
    overall: "healthy" | "degraded" | "critical"
    issues: string[]
  }
}

export default function BotStatusMonitor() {
  const [user] = useAuthState(auth)
  const [status, setStatus] = useState<BotStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActivating, setIsActivating] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testNumber, setTestNumber] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      fetchStatus()
      const interval = setInterval(fetchStatus, 10000) // Update every 10 seconds
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchStatus = async () => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/bot/status", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error("Error fetching bot status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivate = async () => {
    setIsActivating(true)
    setError("")

    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/bot/activate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (data.success) {
        await fetchStatus()
      } else {
        setError(data.error || "Error activando el bot")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setIsActivating(false)
    }
  }

  const handleDeactivate = async () => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/bot/deactivate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await fetchStatus()
      }
    } catch (error) {
      console.error("Error deactivating bot:", error)
    }
  }

  const handleFinalTest = async () => {
    if (!testNumber.trim()) {
      setError("Ingresá un número de prueba")
      return
    }

    setIsTesting(true)
    setError("")

    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/bot/test-final", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ testNumber }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchStatus()
        setTestNumber("")
      } else {
        setError(data.error || "Error en la prueba final")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setIsTesting(false)
    }
  }

  const getStatusIcon = (configured: boolean, status: string) => {
    if (!configured) return <XCircle className="w-4 h-4 text-red-400" />
    if (status === "connected" || status === "configured") return <CheckCircle className="w-4 h-4 text-green-400" />
    return <AlertCircle className="w-4 h-4 text-yellow-400" />
  }

  const getStatusBadge = (configured: boolean, status: string) => {
    if (!configured) return <Badge variant="destructive">No Configurado</Badge>
    if (status === "connected" || status === "configured")
      return <Badge className="bg-green-900/20 text-green-400 border-green-500/20">Activo</Badge>
    return (
      <Badge variant="outline" className="border-yellow-500/20 text-yellow-400">
        Pendiente
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5B358]" />
      </div>
    )
  }

  if (!status) {
    return (
      <Alert variant="destructive" className="bg-red-900/20 border-red-500/20">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-red-400">Error cargando el estado del bot</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#EAEAEA] flex items-center gap-2">
              <Bot className="w-6 h-6 text-[#C5B358]" />
              Estado del Bot
            </CardTitle>
            <div className="flex items-center gap-3">
              {status.active ? (
                <Badge className="bg-green-900/20 text-green-400 border-green-500/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  ACTIVO
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-500/20 text-red-400">
                  INACTIVO
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchStatus}
                className="border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 bg-transparent"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#EAEAEA]">{status.uptime}</p>
              <p className="text-sm text-gray-400">Tiempo Activo</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#EAEAEA]">{status.metrics.messages24h}</p>
              <p className="text-sm text-gray-400">Mensajes 24h</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#EAEAEA]">{status.metrics.avgResponseTime}</p>
              <p className="text-sm text-gray-400">Tiempo Respuesta</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#EAEAEA]">{status.metrics.successRate}</p>
              <p className="text-sm text-gray-400">Tasa de Éxito</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            {status.active ? (
              <Button
                onClick={handleDeactivate}
                variant="outline"
                className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
              >
                <Square className="w-4 h-4 mr-2" />
                Desactivar Bot
              </Button>
            ) : (
              <Button
                onClick={handleActivate}
                disabled={isActivating || status.health.overall === "critical"}
                className="bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
              >
                {isActivating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                Activar Bot
              </Button>
            )}

            <div className="flex gap-2 flex-1">
              <input
                type="text"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                placeholder="Número de prueba (ej: 5491123456789)"
                className="flex-1 px-3 py-2 bg-[#0F0F0F] border border-[#C5B358]/20 rounded-lg text-[#EAEAEA] text-sm"
              />
              <Button
                onClick={handleFinalTest}
                disabled={isTesting || !status.active}
                variant="outline"
                className="border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 bg-transparent"
              >
                {isTesting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <MessageSquare className="w-4 h-4 mr-2" />
                )}
                Prueba Final
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#C5B358]" />
                <span className="text-[#EAEAEA] font-medium">LLM</span>
              </div>
              {getStatusIcon(status.components.llm.configured, status.components.llm.status)}
            </div>
            {getStatusBadge(status.components.llm.configured, status.components.llm.status)}
            {status.components.llm.provider && (
              <p className="text-xs text-gray-400 mt-1">{status.components.llm.provider}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                <span className="text-[#EAEAEA] font-medium">WhatsApp</span>
              </div>
              {getStatusIcon(status.components.whatsapp.configured, status.components.whatsapp.status)}
            </div>
            {getStatusBadge(status.components.whatsapp.configured, status.components.whatsapp.status)}
            {status.components.whatsapp.lastWebhook && (
              <p className="text-xs text-gray-400 mt-1">
                Último: {new Date(status.components.whatsapp.lastWebhook).toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-500" />
                <span className="text-[#EAEAEA] font-medium">Personalidad</span>
              </div>
              {getStatusIcon(status.components.personality.configured, status.components.personality.status)}
            </div>
            {getStatusBadge(status.components.personality.configured, status.components.personality.status)}
            {status.components.personality.botName && (
              <p className="text-xs text-gray-400 mt-1">{status.components.personality.botName}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-500" />
                <span className="text-[#EAEAEA] font-medium">Base Conocimiento</span>
              </div>
              {getStatusIcon(status.components.knowledgeBase.configured, status.components.knowledgeBase.status)}
            </div>
            {getStatusBadge(status.components.knowledgeBase.configured, status.components.knowledgeBase.status)}
            {status.components.knowledgeBase.totalChunks > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {status.components.knowledgeBase.totalDocuments} docs, {status.components.knowledgeBase.totalChunks}{" "}
                chunks
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
          <CardHeader>
            <CardTitle className="text-[#EAEAEA] text-lg">Eventos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {status.recentEvents.length > 0 ? (
                status.recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-[#0F0F0F] rounded-lg">
                    <div>
                      <p className="text-[#EAEAEA] text-sm font-medium">{event.message}</p>
                      <p className="text-gray-400 text-xs">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                    <Badge variant="outline" className="border-[#C5B358]/20 text-[#C5B358] text-xs">
                      {event.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No hay eventos recientes</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
          <CardHeader>
            <CardTitle className="text-[#EAEAEA] text-lg">Mensajes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {status.recentMessages.length > 0 ? (
                status.recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start justify-between p-3 bg-[#0F0F0F] rounded-lg">
                    <div className="flex-1">
                      <p className="text-[#EAEAEA] text-sm">{message.text}</p>
                      <p className="text-gray-400 text-xs">
                        De: {message.from} • {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-green-500/20 text-green-400 text-xs ml-2">
                      {message.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No hay mensajes recientes</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

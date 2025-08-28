"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Bot, 
  Save, 
  Globe, 
  MessageSquare, 
  Smartphone, 
  Monitor, 
  TestTube,
  Copy,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Settings,
  Play,
  Info
} from "lucide-react"
import type { ChatbotConfig } from "@/types/chatbot"

interface Flow {
  id: string
  name: string
  status: 'draft' | 'live'
}

export default function ConfigurarChatbotPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [config, setConfig] = useState<ChatbotConfig>({
    bot: {
      name: "",
      language: "es",
      persona: "Profesional"
    },
    llm: {
      provider: "openai",
      apiKey: "",
      baseUrl: "",
      model: "gpt-4o-mini"
    },
    channels: {},
    flow: {},
    status: "draft"
  })
  
  const [flows, setFlows] = useState<Flow[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testMessage, setTestMessage] = useState("")
  const [testResponse, setTestResponse] = useState("")
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }
    
    if (user) {
      loadConfig()
      loadFlows()
    }
  }, [user, isLoading, router])

  const loadConfig = async () => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/chatbot/config", {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error("Error cargando configuración:", error)
    }
  }

  const loadFlows = async () => {
    // TODO: Cargar flujos desde base de datos
    setFlows([
      { id: "flow1", name: "Flujo de Bienvenida", status: "live" },
      { id: "flow2", name: "Flujo de Soporte", status: "live" },
      { id: "flow3", name: "Flujo de Ventas", status: "draft" }
    ])
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/chatbot/config", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        toast({
          title: "Configuración actualizada",
          description: "Los cambios se han guardado exitosamente",
          variant: "default"
        })
      } else {
        throw new Error("Error al guardar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!canPublish()) {
      toast({
        title: "No se puede publicar",
        description: "Verifica que tengas LLM configurado y al menos un canal activo",
        variant: "destructive"
      })
      return
    }

    setIsPublishing(true)
    try {
      const updatedConfig = { ...config, status: "live" as const }
      setConfig(updatedConfig)
      
      const token = await user?.getIdToken()
      const response = await fetch("/api/chatbot/config", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(updatedConfig)
      })
      
      if (response.ok) {
        toast({
          title: "ChatBot publicado",
          description: "Tu ChatBot está ahora en vivo",
          variant: "default"
        })
      } else {
        throw new Error("Error al publicar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo publicar el ChatBot",
        variant: "destructive"
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleTestConnection = async () => {
    if (!config.llm.provider || !config.llm.model) {
      toast({
        title: "Error",
        description: "Configura un proveedor LLM y modelo primero",
        variant: "destructive"
      })
      return
    }

    setIsTestingConnection(true)
    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/chatbot/test", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          text: "Respondé OK"
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Conexión exitosa",
          description: "El proveedor LLM responde correctamente",
          variant: "default"
        })
      } else {
        throw new Error("Error en la prueba")
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el proveedor LLM",
        variant: "destructive"
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleTestMessage = async () => {
    if (!testMessage.trim()) {
      toast({
        title: "Error",
        description: "Ingresa un mensaje para probar",
        variant: "destructive"
      })
      return
    }

    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/chatbot/test", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          text: testMessage
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setTestResponse(data.reply)
      } else {
        throw new Error("Error en la prueba")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar el mensaje de prueba",
        variant: "destructive"
      })
    }
  }

  const canPublish = () => {
    return config.llm.provider && 
           config.llm.model && 
           (config.channels.whatsapp?.active || 
            config.channels.telegram?.active || 
            config.channels.webchat?.active) &&
           config.flow.defaultFlowId
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado",
      description: "Texto copiado al portapapeles",
      variant: "default"
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <span className="text-[var(--text)]">Cargando configuración...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Header Sticky */}
      <div className="sticky top-0 z-50 bg-[var(--card-contrast)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bot className="w-8 h-8 text-[var(--primary)]" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-balance">Configuración de ChatBot</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline"
                    className={`status-chip ${config.status === "live" ? "live" : "draft"}`}
                  >
                    {config.status === "live" ? "Live" : "Borrador"}
                  </Badge>
                  {config.status === "live" && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={handleSave}
                disabled={isSaving}
                className="text-[var(--text)] hover:bg-[var(--primary)]/10"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Guardar
              </Button>
              <Button 
                onClick={handlePublish}
                disabled={isPublishing || !canPublish()}
                className="btn-gold"
              >
                {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda (md:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Identidad del Bot */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--text)]">
                  <Bot className="w-5 h-5 text-[var(--primary)]" />
                  Identidad del Bot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="botName">Nombre del Bot</Label>
                  <Input
                    id="botName"
                    value={config.bot.name}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      bot: { ...prev.bot, name: e.target.value }
                    }))}
                    placeholder="Mi ChatBot"
                    className="input-field"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={config.bot.language}
                      onValueChange={(value: "es" | "en") => 
                        setConfig(prev => ({
                          ...prev,
                          bot: { ...prev.bot, language: value }
                        }))
                      }
                    >
                      <SelectTrigger className="input-field">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="persona">Persona</Label>
                    <Select
                      value={config.bot.persona}
                      onValueChange={(value: "Profesional" | "Amigable" | "Directo") => 
                        setConfig(prev => ({
                          ...prev,
                          bot: { ...prev.bot, persona: value }
                        }))
                      }
                    >
                      <SelectTrigger className="input-field">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                        <SelectItem value="Profesional">Profesional</SelectItem>
                        <SelectItem value="Amigable">Amigable</SelectItem>
                        <SelectItem value="Directo">Directo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proveedor LLM */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--text)]">
                  <Globe className="w-5 h-5 text-[var(--primary)]" />
                  Proveedor LLM
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Seleccionar Proveedor</Label>
                  <div className="flex gap-3">
                    {["openai", "gemini", "anthropic"].map((provider) => (
                      <Button
                        key={provider}
                        variant={config.llm.provider === provider ? "default" : "outline"}
                        onClick={() => setConfig(prev => ({
                          ...prev,
                          llm: { ...prev.llm, provider: provider as any }
                        }))}
                        className={config.llm.provider === provider ? 
                          "bg-[var(--primary)] text-[var(--primary-foreground)]" : 
                          "border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary)]/10"
                        }
                      >
                        {provider.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={config.llm.apiKey}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      llm: { ...prev.llm, apiKey: e.target.value }
                    }))}
                    placeholder="sk-... o AIza..."
                    className="input-field"
                  />
                  <p className="text-xs text-[var(--text)]/60 mt-1">
                    Si dejas vacío, se heredará de las variables de entorno
                  </p>
                </div>

                {config.llm.provider === "openai" && (
                  <div>
                    <Label htmlFor="baseUrl">Base URL (Opcional)</Label>
                    <Input
                      id="baseUrl"
                      value={config.llm.baseUrl}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        llm: { ...prev.llm, baseUrl: e.target.value }
                      }))}
                      placeholder="https://api.openai.com/v1"
                      className="input-field"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="model">Modelo</Label>
                  <Select
                    value={config.llm.model}
                    onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      llm: { ...prev.llm, model: value }
                    }))}
                  >
                    <SelectTrigger className="input-field">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                      {config.llm.provider === "openai" && (
                        <>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        </>
                      )}
                      {config.llm.provider === "gemini" && (
                        <>
                          <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                          <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                        </>
                      )}
                      {config.llm.provider === "anthropic" && (
                        <>
                          <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                          <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                          <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || !config.llm.provider || !config.llm.model}
                  className="w-full btn-gold"
                >
                  {isTestingConnection ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Probar Conexión
                </Button>
              </CardContent>
            </Card>

            {/* Flujo por Defecto */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--text)]">
                  <Settings className="w-5 h-5 text-[var(--primary)]" />
                  Flujo por Defecto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="defaultFlow">Flujo Seleccionado</Label>
                  <Select
                    value={config.flow.defaultFlowId}
                    onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      flow: { ...prev.flow, defaultFlowId: value }
                    }))}
                  >
                    <SelectTrigger className="input-field">
                      <SelectValue placeholder="Selecciona un flujo publicado" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                      {flows.filter(f => f.status === "live").map(flow => (
                        <SelectItem key={flow.id} value={flow.id}>
                          {flow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {flows.filter(f => f.status === "live").length === 0 ? (
                  <div className="p-4 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg">
                    <p className="text-[var(--text)]/80 text-sm">
                      Aún no hay flujos publicados. Crea y publica un flujo primero.
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/flows")}
                    className="w-full border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary)]/10"
                  >
                    Abrir Editor de Flujos
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha (md:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Canales */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--text)]">
                  <MessageSquare className="w-5 h-5 text-[var(--primary)]" />
                  Canales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="whatsapp" className="w-full">
                  <TabsList className="bg-transparent border-b border-[var(--border)] rounded-none">
                    <TabsTrigger
                      value="whatsapp"
                      className="tab-inactive data-[state=active]:tab-active"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </TabsTrigger>
                    <TabsTrigger
                      value="telegram"
                      className="tab-inactive data-[state=active]:tab-active"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Telegram
                    </TabsTrigger>
                    <TabsTrigger
                      value="webchat"
                      className="tab-inactive data-[state=active]:tab-active"
                    >
                      <Monitor className="w-4 h-4 mr-2" />
                      Webchat
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="whatsapp" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <Label>Activar Canal WhatsApp</Label>
                      <Switch
                        checked={config.channels.whatsapp?.active || false}
                        onCheckedChange={(checked) => {
                          setConfig(prev => ({
                            ...prev,
                            channels: {
                              ...prev.channels,
                              whatsapp: checked ? {
                                active: true,
                                phoneNumberId: "",
                                verifyToken: "",
                                appSecret: "",
                                accessToken: ""
                              } : undefined
                            }
                          }))
                        }}
                      />
                    </div>
                    
                    {config.channels.whatsapp && (
                      <div className="space-y-3 p-4 bg-[var(--muted)] rounded-lg">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                            <Input
                              id="phoneNumberId"
                              value={config.channels.whatsapp.phoneNumberId}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                channels: {
                                  ...prev.channels,
                                  whatsapp: {
                                    ...prev.channels.whatsapp!,
                                    phoneNumberId: e.target.value
                                  }
                                }
                              }))}
                              placeholder="123456789"
                              className="input-field"
                            />
                          </div>
                          <div>
                            <Label htmlFor="verifyToken">Verify Token</Label>
                            <Input
                              id="verifyToken"
                              value={config.channels.whatsapp.verifyToken}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                channels: {
                                  ...prev.channels,
                                  whatsapp: {
                                    ...prev.channels.whatsapp!,
                                    verifyToken: e.target.value
                                  }
                                }
                              }))}
                              placeholder="mi_token_secreto"
                              className="input-field"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="appSecret">App Secret</Label>
                          <Input
                            id="appSecret"
                            type="password"
                            value={config.channels.whatsapp.appSecret}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              channels: {
                                ...prev.channels,
                                whatsapp: {
                                  ...prev.channels.whatsapp!,
                                  appSecret: e.target.value
                                }
                              }
                            }))}
                            placeholder="app_secret_aqui"
                            className="input-field"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="accessToken">Access Token</Label>
                          <Input
                            id="accessToken"
                            type="password"
                            value={config.channels.whatsapp.accessToken}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              channels: {
                                ...prev.channels,
                                whatsapp: {
                                  ...prev.channels.whatsapp!,
                                  accessToken: e.target.value
                                }
                              }
                            }))}
                            placeholder="access_token_aqui"
                            className="input-field"
                          />
                        </div>

                        <div>
                          <Label>Webhook URL</Label>
                          <div className="flex gap-2">
                            <Input
                              value={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003"}/api/webhooks/whatsapp/channelId`}
                              readOnly
                              className="input-field"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003"}/api/webhooks/whatsapp/channelId`)}
                              className="border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary)]/10"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary)]/10"
                          >
                            Verificar Webhook
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary)]/10"
                          >
                            Probar Envío
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="telegram" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <Label>Activar Canal Telegram</Label>
                      <Switch
                        checked={config.channels.telegram?.active || false}
                        onCheckedChange={(checked) => {
                          setConfig(prev => ({
                            ...prev,
                            channels: {
                              ...prev.channels,
                              telegram: checked ? {
                                active: true,
                                botToken: ""
                              } : undefined
                            }
                          }))
                        }}
                      />
                    </div>
                    
                    {config.channels.telegram && (
                      <div className="space-y-3 p-4 bg-[var(--muted)] rounded-lg">
                        <div>
                          <Label htmlFor="botToken">Bot Token</Label>
                          <Input
                            id="botToken"
                            type="password"
                            value={config.channels.telegram.botToken}
                            onChange={(e) => setConfig(prev => ({
                              ...prev,
                              channels: {
                                ...prev.channels,
                                telegram: {
                                  ...prev.channels.telegram!,
                                  botToken: e.target.value
                                }
                              }
                            }))}
                            placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                            className="input-field"
                          />
                        </div>

                        <div>
                          <Label>Webhook URL</Label>
                          <div className="flex gap-2">
                            <Input
                              value={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003"}/api/webhooks/telegram/channelId`}
                              readOnly
                              className="input-field"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003"}/api/webhooks/telegram/channelId`)}
                              className="border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary)]/10"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary)]/10"
                          >
                            Set Webhook
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary)]/10"
                          >
                            Probar /hola
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="webchat" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <Label>Activar Canal Webchat</Label>
                      <Switch
                        checked={config.channels.webchat?.active || false}
                        onCheckedChange={(checked) => {
                          setConfig(prev => ({
                            ...prev,
                            channels: {
                              ...prev.channels,
                              webchat: checked ? {
                                active: true,
                                publicSlug: `webchat_${Date.now()}`
                              } : undefined
                            }
                          }))
                        }}
                      />
                    </div>
                    
                    {config.channels.webchat && (
                      <div className="space-y-3 p-4 bg-[var(--muted)] rounded-lg">
                        <div>
                          <Label>Public Slug</Label>
                          <Input
                            value={config.channels.webchat.publicSlug}
                            readOnly
                            className="input-field"
                          />
                        </div>

                        <div>
                          <Label>Snippet de Integración</Label>
                          <Textarea
                            value={`<script src="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003"}/embed/webchat.js" defer></script>\n<div id="automatia-chat" data-bot="${config.bot.name || "bot"}" data-slug="${config.channels.webchat.publicSlug}"></div>`}
                            readOnly
                            rows={3}
                            className="input-field font-mono text-sm"
                          />
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(`<script src="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003"}/embed/webchat.js" defer></script>\n<div id="automatia-chat" data-bot="${config.bot.name || "bot"}" data-slug="${config.channels.webchat.publicSlug}"></div>`)}
                          className="w-full border-[var(--border)] text-[var(--text)] hover:bg-[var(--primary)]/10"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Snippet
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Consola de Prueba */}
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--text)]">
                  <TestTube className="w-5 h-5 text-[var(--primary)]" />
                  Consola de Prueba
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Mostrar Logs</Label>
                  <Switch
                    checked={showLogs}
                    onCheckedChange={setShowLogs}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="testMessage">Mensaje de Prueba</Label>
                  <div className="flex gap-2">
                    <Input
                      id="testMessage"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      placeholder="Escribí un mensaje para probar..."
                      className="flex-1 input-field"
                    />
                    <Button
                      onClick={handleTestMessage}
                      disabled={!testMessage.trim()}
                      className="btn-gold"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {testResponse && (
                  <div className="p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
                    <Label className="text-sm text-[var(--text)]/70">Respuesta:</Label>
                    <p className="text-[var(--text)] mt-1">{testResponse}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Sticky */}
      <div className="sticky bottom-0 z-50 bg-[var(--card-contrast)]/95 backdrop-blur-sm border-t border-[var(--border)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[var(--text)]/60">
              Última actualización: {new Date().toLocaleString("es-AR")}
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={handleSave}
                disabled={isSaving}
                className="text-[var(--text)] hover:bg-[var(--primary)]/10"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Guardar
              </Button>
              <Button 
                onClick={handlePublish}
                disabled={isPublishing || !canPublish()}
                className="btn-gold"
              >
                {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

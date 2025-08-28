"use client"

import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, AlertCircle, Loader2, Copy, ExternalLink, MessageSquare, Globe } from "lucide-react"

type SetupStep =
  | "provider"
  | "apikey"
  | "test"
  | "model"
  | "instructions"
  | "channels"
  | "whatsapp"
  | "webwidget"
  | "activate"
  | "complete"

interface SetupWizardProps {
  onComplete: () => void
}

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [user] = useAuthState(auth)
  const [currentStep, setCurrentStep] = useState<SetupStep>("provider")
  const [provider, setProvider] = useState<"openai" | "gemini">("openai")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("")
  const [instructions, setInstructions] = useState(
    "Sos el chatbot oficial de Automatía. Respondé claro, al hueso y con tono argentino. Si falta info, pedila. Proponé acciones concretas.",
  )

  const [whatsappConfig, setWhatsappConfig] = useState({
    metaAppId: "",
    metaAppSecret: "",
    wabaId: "",
    phoneNumberId: "",
    permanentToken: "",
    webhookVerifyToken: "",
    testNumber: "",
    enabled: false,
  })

  const [webWidgetConfig, setWebWidgetConfig] = useState({
    enabled: true,
    position: "bottom-right" as "bottom-right" | "bottom-left",
    greeting: "¡Hola! ¿En qué puedo ayudarte?",
    theme: "dark" as "dark" | "light",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const [whatsappTestResult, setWhatsappTestResult] = useState<"success" | "error" | null>(null)
  const [error, setError] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")

  const handleProviderNext = () => {
    setCurrentStep("apikey")
  }

  const handleApiKeyNext = async () => {
    if (!apiKey.trim()) {
      setError("La API Key es requerida")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/secrets/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ provider, apiKey }),
      })

      if (!response.ok) {
        throw new Error("Error guardando la API Key")
      }

      setCurrentStep("test")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTest = async () => {
    setIsLoading(true)
    setTestResult(null)
    setError("")

    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/admin/test-llm", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTestResult("success")
        setTimeout(() => setCurrentStep("model"), 1500)
      } else {
        setTestResult("error")
        setError("Error en la conexión. Verificá tu API Key.")
      }
    } catch (err) {
      setTestResult("error")
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleModelNext = () => {
    if (!model) {
      setError("Seleccioná un modelo")
      return
    }
    setCurrentStep("instructions")
  }

  const handleChannelsNext = () => {
    if (whatsappConfig.enabled) {
      setCurrentStep("whatsapp")
    } else if (webWidgetConfig.enabled) {
      setCurrentStep("webwidget")
    } else {
      setCurrentStep("activate")
    }
  }

  const handleWhatsAppSave = async () => {
    setIsLoading(true)
    setError("")

    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/secrets/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          metaAppId: whatsappConfig.metaAppId,
          metaAppSecret: whatsappConfig.metaAppSecret,
          wabaId: whatsappConfig.wabaId,
          phoneNumberId: whatsappConfig.phoneNumberId,
          permanentToken: whatsappConfig.permanentToken,
          webhookVerifyToken: whatsappConfig.webhookVerifyToken,
        }),
      })

      if (!response.ok) {
        throw new Error("Error guardando configuración WhatsApp")
      }

      const webhookResponse = await fetch("/api/secrets/whatsapp", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const webhookData = await webhookResponse.json()
      setWebhookUrl(webhookData.webhookUrl)

      if (webWidgetConfig.enabled) {
        setCurrentStep("webwidget")
      } else {
        setCurrentStep("activate")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWhatsAppTest = async () => {
    if (!whatsappConfig.testNumber) {
      setError("Ingresá un número de prueba")
      return
    }

    setIsLoading(true)
    setWhatsappTestResult(null)
    setError("")

    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/whatsapp/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ testNumber: whatsappConfig.testNumber }),
      })

      const data = await response.json()

      if (data.success) {
        setWhatsappTestResult("success")
      } else {
        setWhatsappTestResult("error")
        setError(data.error || "Error enviando mensaje de prueba")
      }
    } catch (err) {
      setWhatsappTestResult("error")
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWebWidgetNext = () => {
    setCurrentStep("activate")
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/admin/features/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          enabled: true,
          model,
          instructions,
          channels: {
            whatsapp: whatsappConfig.enabled,
            webWidget: webWidgetConfig.enabled,
          },
          webWidgetConfig,
        }),
      })

      if (!response.ok) {
        throw new Error("Error activando el chatbot")
      }

      setCurrentStep("complete")
      setTimeout(() => onComplete(), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const renderStep = () => {
    switch (currentStep) {
      case "provider":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-[#EAEAEA]">Seleccioná tu proveedor de IA</Label>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card
                  className={`cursor-pointer transition-all border-[#C5B358]/20 bg-[#0F0F0F] hover:bg-[#0F0F0F]/80 ${
                    provider === "openai" ? "ring-2 ring-[#C5B358] bg-[#C5B358]/10" : ""
                  }`}
                  onClick={() => setProvider("openai")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl mb-2">🤖</div>
                    <h3 className="font-semibold text-[#EAEAEA]">OpenAI</h3>
                    <p className="text-sm text-gray-400">GPT-4, GPT-3.5</p>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer transition-all border-[#C5B358]/20 bg-[#0F0F0F] hover:bg-[#0F0F0F]/80 ${
                    provider === "gemini" ? "ring-2 ring-[#C5B358] bg-[#C5B358]/10" : ""
                  }`}
                  onClick={() => setProvider("gemini")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl mb-2">✨</div>
                    <h3 className="font-semibold text-[#EAEAEA]">Google Gemini</h3>
                    <p className="text-sm text-gray-400">Gemini Pro</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Button
              onClick={handleProviderNext}
              className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
            >
              Continuar
            </Button>
          </div>
        )

      case "apikey":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="apikey" className="text-base font-semibold text-[#EAEAEA]">
                Pegá tu API Key de {provider === "openai" ? "OpenAI" : "Google"}
              </Label>
              <p className="text-sm text-gray-400 mt-1">Queda guardada en el servidor, cifrada y segura</p>
              <Input
                id="apikey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === "openai" ? "sk-..." : "AIza..."}
                className="mt-2 bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA] focus:ring-[#C5B358] focus:border-[#C5B358]"
              />
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleApiKeyNext}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Guardar y Continuar
            </Button>
          </div>
        )

      case "test":
        return (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#EAEAEA]">Probemos la conexión</h3>
              <p className="text-gray-400">Vamos a hacer una prueba rápida con tu API Key</p>
            </div>

            {testResult === "success" && (
              <Alert className="bg-green-900/20 border-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400">
                  ¡Perfecto! La conexión funciona correctamente
                </AlertDescription>
              </Alert>
            )}

            {testResult === "error" && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleTest}
              disabled={isLoading || testResult === "success"}
              className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {testResult === "success" ? "¡Listo!" : "Probar Conexión"}
            </Button>
          </div>
        )

      case "model":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-[#EAEAEA]">Elegí el modelo</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="mt-2 bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]">
                  <SelectValue placeholder="Seleccioná un modelo" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F0F] border-[#C5B358]/20">
                  {provider === "openai" ? (
                    <>
                      <SelectItem value="gpt-4o-mini" className="text-[#EAEAEA] focus:bg-[#C5B358]/20">
                        GPT-4o Mini (Recomendado)
                      </SelectItem>
                      <SelectItem value="gpt-4o" className="text-[#EAEAEA] focus:bg-[#C5B358]/20">
                        GPT-4o (Premium)
                      </SelectItem>
                      <SelectItem value="gpt-3.5-turbo" className="text-[#EAEAEA] focus:bg-[#C5B358]/20">
                        GPT-3.5 Turbo (Económico)
                      </SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="gemini-1.5-flash" className="text-[#EAEAEA] focus:bg-[#C5B358]/20">
                        Gemini 1.5 Flash (Recomendado)
                      </SelectItem>
                      <SelectItem value="gemini-1.5-pro" className="text-[#EAEAEA] focus:bg-[#C5B358]/20">
                        Gemini 1.5 Pro (Premium)
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleModelNext}
              className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
            >
              Continuar
            </Button>
          </div>
        )

      case "instructions":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="instructions" className="text-base font-semibold text-[#EAEAEA]">
                Instrucciones del chatbot
              </Label>
              <p className="text-sm text-gray-400 mt-1">Definí cómo debe comportarse tu asistente</p>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                className="mt-2 bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA] focus:ring-[#C5B358] focus:border-[#C5B358]"
              />
            </div>
            <Button
              onClick={handleChannelsNext}
              className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
            >
              Continuar
            </Button>
          </div>
        )

      case "channels":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-[#EAEAEA]">Seleccioná los canales</Label>
              <p className="text-sm text-gray-400 mt-1">Elegí dónde querés que funcione tu chatbot</p>
            </div>

            <div className="space-y-4">
              <Card
                className={`border-[#C5B358]/20 bg-[#0F0F0F] ${whatsappConfig.enabled ? "ring-2 ring-[#C5B358]" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-6 h-6 text-green-500" />
                      <div>
                        <h3 className="font-semibold text-[#EAEAEA]">WhatsApp Business</h3>
                        <p className="text-sm text-gray-400">API oficial de Meta</p>
                      </div>
                    </div>
                    <Switch
                      checked={whatsappConfig.enabled}
                      onCheckedChange={(checked) => setWhatsappConfig((prev) => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`border-[#C5B358]/20 bg-[#0F0F0F] ${webWidgetConfig.enabled ? "ring-2 ring-[#C5B358]" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-6 h-6 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-[#EAEAEA]">Web Widget</h3>
                        <p className="text-sm text-gray-400">Chat en tu sitio web</p>
                      </div>
                    </div>
                    <Switch
                      checked={webWidgetConfig.enabled}
                      onCheckedChange={(checked) => setWebWidgetConfig((prev) => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={handleChannelsNext}
              disabled={!whatsappConfig.enabled && !webWidgetConfig.enabled}
              className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
            >
              Continuar
            </Button>
          </div>
        )

      case "whatsapp":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-[#EAEAEA] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                Configuración WhatsApp Business
              </Label>
              <p className="text-sm text-gray-400 mt-1">Conectá tu cuenta de WhatsApp Business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metaAppId" className="text-[#EAEAEA]">
                  Meta App ID
                </Label>
                <Input
                  id="metaAppId"
                  value={whatsappConfig.metaAppId}
                  onChange={(e) => setWhatsappConfig((prev) => ({ ...prev, metaAppId: e.target.value }))}
                  className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
                  placeholder="123456789012345"
                />
              </div>
              <div>
                <Label htmlFor="metaAppSecret" className="text-[#EAEAEA]">
                  Meta App Secret
                </Label>
                <Input
                  id="metaAppSecret"
                  type="password"
                  value={whatsappConfig.metaAppSecret}
                  onChange={(e) => setWhatsappConfig((prev) => ({ ...prev, metaAppSecret: e.target.value }))}
                  className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
                  placeholder="abc123..."
                />
              </div>
              <div>
                <Label htmlFor="wabaId" className="text-[#EAEAEA]">
                  WABA ID
                </Label>
                <Input
                  id="wabaId"
                  value={whatsappConfig.wabaId}
                  onChange={(e) => setWhatsappConfig((prev) => ({ ...prev, wabaId: e.target.value }))}
                  className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
                  placeholder="123456789012345"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumberId" className="text-[#EAEAEA]">
                  Phone Number ID
                </Label>
                <Input
                  id="phoneNumberId"
                  value={whatsappConfig.phoneNumberId}
                  onChange={(e) => setWhatsappConfig((prev) => ({ ...prev, phoneNumberId: e.target.value }))}
                  className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
                  placeholder="123456789012345"
                />
              </div>
              <div>
                <Label htmlFor="permanentToken" className="text-[#EAEAEA]">
                  Permanent Token
                </Label>
                <Input
                  id="permanentToken"
                  type="password"
                  value={whatsappConfig.permanentToken}
                  onChange={(e) => setWhatsappConfig((prev) => ({ ...prev, permanentToken: e.target.value }))}
                  className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
                  placeholder="EAAx..."
                />
              </div>
              <div>
                <Label htmlFor="webhookVerifyToken" className="text-[#EAEAEA]">
                  Webhook Verify Token
                </Label>
                <Input
                  id="webhookVerifyToken"
                  value={whatsappConfig.webhookVerifyToken}
                  onChange={(e) => setWhatsappConfig((prev) => ({ ...prev, webhookVerifyToken: e.target.value }))}
                  className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
                  placeholder="mi_token_secreto"
                />
              </div>
            </div>

            {webhookUrl && (
              <div className="space-y-2">
                <Label className="text-[#EAEAEA]">Webhook URL (copiá esto en Meta)</Label>
                <div className="flex gap-2">
                  <Input value={webhookUrl} readOnly className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(webhookUrl)}
                    className="border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  Verify Token:{" "}
                  <code className="bg-[#0F0F0F] px-2 py-1 rounded">{whatsappConfig.webhookVerifyToken}</code>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="testNumber" className="text-[#EAEAEA]">
                  Número de prueba (con código de país)
                </Label>
                <Input
                  id="testNumber"
                  value={whatsappConfig.testNumber}
                  onChange={(e) => setWhatsappConfig((prev) => ({ ...prev, testNumber: e.target.value }))}
                  className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
                  placeholder="5491123456789"
                />
              </div>

              {whatsappTestResult === "success" && (
                <Alert className="bg-green-900/20 border-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    ¡Mensaje enviado correctamente! WhatsApp está configurado.
                  </AlertDescription>
                </Alert>
              )}

              {whatsappTestResult === "error" && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleWhatsAppSave}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Guardar Configuración
              </Button>
              {webhookUrl && (
                <Button
                  onClick={handleWhatsAppTest}
                  disabled={isLoading || !whatsappConfig.testNumber}
                  variant="outline"
                  className="border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 bg-transparent"
                >
                  Probar Envío
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ExternalLink className="h-4 w-4" />
              <a
                href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5B358] hover:underline"
              >
                Guía de configuración en Meta
              </a>
            </div>
          </div>
        )

      case "webwidget":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-[#EAEAEA] flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Configuración Web Widget
              </Label>
              <p className="text-sm text-gray-400 mt-1">Personalizá el chat de tu sitio web</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#EAEAEA]">Posición</Label>
                <Select
                  value={webWidgetConfig.position}
                  onValueChange={(value: "bottom-right" | "bottom-left") =>
                    setWebWidgetConfig((prev) => ({ ...prev, position: value }))
                  }
                >
                  <SelectTrigger className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F0F0F] border-[#C5B358]/20">
                    <SelectItem value="bottom-right" className="text-[#EAEAEA]">
                      Abajo Derecha
                    </SelectItem>
                    <SelectItem value="bottom-left" className="text-[#EAEAEA]">
                      Abajo Izquierda
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#EAEAEA]">Tema</Label>
                <Select
                  value={webWidgetConfig.theme}
                  onValueChange={(value: "dark" | "light") => setWebWidgetConfig((prev) => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F0F0F] border-[#C5B358]/20">
                    <SelectItem value="dark" className="text-[#EAEAEA]">
                      Oscuro
                    </SelectItem>
                    <SelectItem value="light" className="text-[#EAEAEA]">
                      Claro
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="greeting" className="text-[#EAEAEA]">
                Mensaje de saludo
              </Label>
              <Input
                id="greeting"
                value={webWidgetConfig.greeting}
                onChange={(e) => setWebWidgetConfig((prev) => ({ ...prev, greeting: e.target.value }))}
                className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
                placeholder="¡Hola! ¿En qué puedo ayudarte?"
              />
            </div>

            <div className="bg-[#0F0F0F] p-4 rounded-lg border border-[#C5B358]/20">
              <Label className="text-[#EAEAEA] mb-2 block">Script para embeber</Label>
              <code className="text-sm text-gray-300 block bg-black p-3 rounded overflow-x-auto">
                {`<script>
  window.AutomatiaWidget = {
    position: "${webWidgetConfig.position}",
    theme: "${webWidgetConfig.theme}",
    greeting: "${webWidgetConfig.greeting}"
  };
</script>
<script src="https://automatia.ar/widget.js"></script>`}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(`<script>
  window.AutomatiaWidget = {
    position: "${webWidgetConfig.position}",
    theme: "${webWidgetConfig.theme}",
    greeting: "${webWidgetConfig.greeting}"
  };
</script>
<script src="https://automatia.ar/widget.js"></script>`)
                }
                className="mt-2 border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Script
              </Button>
            </div>

            <Button
              onClick={handleWebWidgetNext}
              className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
            >
              Continuar
            </Button>
          </div>
        )

      case "activate":
        return (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#EAEAEA]">¡Todo listo!</h3>
              <p className="text-gray-400">Revisá la configuración y activá tu chatbot</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#0F0F0F] rounded-lg border border-[#C5B358]/20">
                <span className="text-[#EAEAEA]">LLM ({provider === "openai" ? "OpenAI" : "Gemini"})</span>
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              {whatsappConfig.enabled && (
                <div className="flex items-center justify-between p-3 bg-[#0F0F0F] rounded-lg border border-[#C5B358]/20">
                  <span className="text-[#EAEAEA]">WhatsApp Business</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
              )}
              {webWidgetConfig.enabled && (
                <div className="flex items-center justify-between p-3 bg-[#0F0F0F] rounded-lg border border-[#C5B358]/20">
                  <span className="text-[#EAEAEA]">Web Widget</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
              )}
            </div>

            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Activar Chatbot Pro
            </Button>
          </div>
        )

      case "complete":
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#EAEAEA]">¡Chatbot Activado!</h3>
              <p className="text-gray-400">Tu asistente de IA ya está funcionando</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400">
                El sistema está procesando la configuración. En unos segundos podrás usar tu chatbot.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
        <CardHeader>
          <CardTitle className="text-center text-[#EAEAEA]">Configuración del Chatbot Pro</CardTitle>
          <div className="flex justify-center space-x-2 mt-4">
            {["provider", "apikey", "test", "model", "instructions", "channels", "activate"].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-colors ${
                  [
                    "provider",
                    "apikey",
                    "test",
                    "model",
                    "instructions",
                    "channels",
                    "whatsapp",
                    "webwidget",
                    "activate",
                    "complete",
                  ].indexOf(currentStep) >= index
                    ? "bg-[#C5B358]"
                    : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </div>
  )
}

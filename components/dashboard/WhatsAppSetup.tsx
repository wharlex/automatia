"use client"

import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Copy, ExternalLink } from "lucide-react"

interface WhatsAppSetupProps {
  onComplete: () => void
}

export default function WhatsAppSetup({ onComplete }: WhatsAppSetupProps) {
  const [user] = useAuthState(auth)
  const [formData, setFormData] = useState({
    metaAppId: "",
    metaAppSecret: "",
    wabaId: "",
    phoneNumberId: "",
    permanentToken: "",
    webhookVerifyToken: "",
    testNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const [error, setError] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveConfig = async () => {
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
          metaAppId: formData.metaAppId,
          metaAppSecret: formData.metaAppSecret,
          wabaId: formData.wabaId,
          phoneNumberId: formData.phoneNumberId,
          permanentToken: formData.permanentToken,
          webhookVerifyToken: formData.webhookVerifyToken,
        }),
      })

      if (!response.ok) {
        throw new Error("Error guardando configuración")
      }

      const webhookResponse = await fetch("/api/secrets/whatsapp", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const webhookData = await webhookResponse.json()
      setWebhookUrl(webhookData.webhookUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestWhatsApp = async () => {
    if (!formData.testNumber) {
      setError("Ingresá un número de prueba")
      return
    }

    setIsLoading(true)
    setTestResult(null)
    setError("")

    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/whatsapp/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ testNumber: formData.testNumber }),
      })

      const data = await response.json()

      if (data.success) {
        setTestResult("success")
        setTimeout(() => onComplete(), 2000)
      } else {
        setTestResult("error")
        setError(data.error || "Error enviando mensaje de prueba")
      }
    } catch (err) {
      setTestResult("error")
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
        <CardHeader>
          <CardTitle className="text-[#EAEAEA] flex items-center gap-2">
            <span className="text-2xl">📱</span>
            Configuración WhatsApp Business
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="metaAppId" className="text-[#EAEAEA]">
                Meta App ID
              </Label>
              <Input
                id="metaAppId"
                value={formData.metaAppId}
                onChange={(e) => handleInputChange("metaAppId", e.target.value)}
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
                value={formData.metaAppSecret}
                onChange={(e) => handleInputChange("metaAppSecret", e.target.value)}
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
                value={formData.wabaId}
                onChange={(e) => handleInputChange("wabaId", e.target.value)}
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
                value={formData.phoneNumberId}
                onChange={(e) => handleInputChange("phoneNumberId", e.target.value)}
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
                value={formData.permanentToken}
                onChange={(e) => handleInputChange("permanentToken", e.target.value)}
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
                value={formData.webhookVerifyToken}
                onChange={(e) => handleInputChange("webhookVerifyToken", e.target.value)}
                className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
                placeholder="mi_token_secreto"
              />
            </div>
          </div>

          <Button
            onClick={handleSaveConfig}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Guardar Configuración
          </Button>

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
                Verify Token: <code className="bg-[#0F0F0F] px-2 py-1 rounded">{formData.webhookVerifyToken}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
        <CardHeader>
          <CardTitle className="text-[#EAEAEA]">Prueba de Envío</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testNumber" className="text-[#EAEAEA]">
              Número de prueba (con código de país)
            </Label>
            <Input
              id="testNumber"
              value={formData.testNumber}
              onChange={(e) => handleInputChange("testNumber", e.target.value)}
              className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
              placeholder="5491123456789"
            />
          </div>

          {testResult === "success" && (
            <Alert className="bg-green-900/20 border-green-500/20">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                ¡Mensaje enviado correctamente! WhatsApp está configurado.
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
            onClick={handleTestWhatsApp}
            disabled={isLoading || !webhookUrl}
            className="w-full bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Enviar Mensaje de Prueba
          </Button>

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
        </CardContent>
      </Card>

      {error && !testResult && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-500/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

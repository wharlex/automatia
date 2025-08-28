"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MessageSquare, QrCode, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function WhatsAppPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] to-[#1a365d] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-automatia-gold mx-auto mb-4"></div>
          <p className="text-automatia-white">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simular conexión
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnecting(false)
    setIsConnected(true)
    alert('WhatsApp conectado exitosamente!')
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    alert('WhatsApp desconectado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] to-[#1a365d] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="text-automatia-white hover:text-automatia-gold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-automatia-gold to-automatia-gold-bright rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-automatia-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-automatia-white">Conectar WhatsApp</h1>
                <p className="text-automatia-gold">Integra tu cuenta de WhatsApp Business</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <Card className="bg-automatia-black/50 border-automatia-gold/20 mb-8">
          <CardHeader>
            <CardTitle className="text-automatia-gold">Estado de la Conexión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {isConnected ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-green-400 font-medium">WhatsApp Conectado</p>
                    <p className="text-gray-400 text-sm">Tu cuenta está sincronizada y funcionando</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-yellow-400 font-medium">WhatsApp No Conectado</p>
                    <p className="text-gray-400 text-sm">Conecta tu cuenta para comenzar a usar el chatbot</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Connection Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Connection */}
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardHeader>
              <CardTitle className="text-automatia-gold">Conexión por QR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-automatia-black/30 rounded-lg p-8 text-center border border-automatia-gold/20">
                <QrCode className="w-24 h-24 text-automatia-gold mx-auto mb-4" />
                <p className="text-automatia-white mb-2">Escanea el código QR</p>
                <p className="text-gray-400 text-sm">Abre WhatsApp en tu teléfono y escanea este código</p>
              </div>
              
              <Button 
                onClick={handleConnect}
                disabled={isConnecting || isConnected}
                className="w-full bg-automatia-gold text-automatia-black hover:bg-automatia-gold-bright"
              >
                {isConnecting ? 'Conectando...' : 'Generar QR'}
              </Button>
            </CardContent>
          </Card>

          {/* Manual Connection */}
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardHeader>
              <CardTitle className="text-automatia-gold">Conexión Manual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-automatia-white">Número de WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  className="bg-automatia-black/30 border-automatia-gold/20 text-automatia-white"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>

              <div>
                <Label htmlFor="business" className="text-automatia-white">Nombre del Negocio</Label>
                <Input
                  id="business"
                  className="bg-automatia-black/30 border-automatia-gold/20 text-automatia-white"
                  placeholder="Mi Empresa"
                />
              </div>

              <Button 
                variant="outline"
                className="w-full border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
              >
                Configurar Manualmente
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Connected Account Info */}
        {isConnected && (
          <Card className="bg-automatia-black/50 border-automatia-gold/20 mt-8">
            <CardHeader>
              <CardTitle className="text-automatia-gold">Cuenta Conectada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-automatia-black/30 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Número</p>
                  <p className="text-automatia-white font-medium">+54 9 11 1234-5678</p>
                </div>
                
                <div className="bg-automatia-black/30 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Negocio</p>
                  <p className="text-automatia-white font-medium">Mi Empresa</p>
                </div>
                
                <div className="bg-automatia-black/30 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Estado</p>
                  <p className="text-green-400 font-medium">Activo</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600/10"
                >
                  Desconectar WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <Card className="bg-automatia-black/30 border-automatia-gold/20 mt-8">
          <CardHeader>
            <CardTitle className="text-automatia-gold">Funcionalidades Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-automatia-white font-medium">✅ Respuestas Automáticas</h4>
                <h4 className="text-automatia-white font-medium">✅ Chatbot 24/7</h4>
                <h4 className="text-automatia-white font-medium">✅ Gestión de Conversaciones</h4>
              </div>
              <div className="space-y-3">
                <h4 className="text-automatia-white font-medium">✅ Análisis de Mensajes</h4>
                <h4 className="text-automatia-white font-medium">✅ Integración con IA</h4>
                <h4 className="text-automatia-white font-medium">✅ Reportes y Métricas</h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


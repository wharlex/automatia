"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, MessageCircle, Zap, AlertCircle } from "lucide-react"

interface LockedFeatureProps {
  feature: 'chatbot' | 'flows' | 'knowledge' | 'analytics'
  userEmail?: string
}

export function LockedFeature({ feature, userEmail }: LockedFeatureProps) {
  const features = {
    chatbot: {
      title: "Chatbot de WhatsApp",
      description: "Automatiza la atención al cliente con IA avanzada",
      icon: MessageCircle,
      benefits: [
        "Respuestas automáticas 24/7",
        "Integración con WhatsApp Business",
        "IA personalizable para tu negocio",
        "Análisis de conversaciones"
      ]
    },
    flows: {
      title: "Flujos de Conversación",
      description: "Crea experiencias personalizadas para tus clientes",
      icon: Zap,
      benefits: [
        "Flujos conversacionales avanzados",
        "Integración con CRM",
        "Automatización de ventas",
        "Seguimiento de leads"
      ]
    },
    knowledge: {
      title: "Base de Conocimiento",
      description: "Entrena tu IA con información específica de tu negocio",
      icon: MessageCircle,
      benefits: [
        "Carga de documentos y PDFs",
        "Entrenamiento personalizado",
        "Respuestas más precisas",
        "Actualización en tiempo real"
      ]
    },
    analytics: {
      title: "Analíticas Avanzadas",
      description: "Métricas detalladas del rendimiento de tu chatbot",
      icon: Zap,
      benefits: [
        "Dashboard en tiempo real",
        "Métricas de conversión",
        "Análisis de satisfacción",
        "Reportes personalizados"
      ]
    }
  }

  const currentFeature = features[feature]
  const IconComponent = currentFeature.icon

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <IconComponent className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Lock className="w-6 h-6 text-yellow-500" />
            {currentFeature.title}
          </CardTitle>
          <CardDescription className="text-lg">
            {currentFeature.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Característica Bloqueada</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {userEmail ? (
                <>
                  Tu cuenta <strong>{userEmail}</strong> no tiene acceso a esta funcionalidad.
                  Contacta al administrador para solicitar acceso.
                </>
              ) : (
                "Debes iniciar sesión para acceder a esta funcionalidad."
              )}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">¿Qué incluye?</h4>
            <ul className="space-y-2">
              {currentFeature.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contactar Soporte
            </Button>
            <Button className="flex-1">
              <Zap className="w-4 h-4 mr-2" />
              Solicitar Acceso
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>¿Eres administrador? Gestiona el acceso desde el panel de administración.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

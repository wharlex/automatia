"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  Play,
  Lock,
  MessageSquare,
  BarChart3,
  Headphones,
  Cog,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  HelpCircle,
  CreditCard,
  BookOpen,
} from "lucide-react"
import ChatbotConfig from "@/components/dashboard/ChatbotConfig"

interface BusinessConfig {
  businessName: string
  industry: string
  whatsapp: string
  hours: string
  menuLink: string
  email: string
}

export default function DashboardPage() {
  const [config, setConfig] = useState<BusinessConfig>({
    businessName: "",
    industry: "",
    whatsapp: "",
    hours: "",
    menuLink: "",
    email: "",
  })
  const [isConfigured, setIsConfigured] = useState(false)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)

  useEffect(() => {
    // Load config from localStorage
    const savedConfig = localStorage.getItem("automatia-config")
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig)
      setConfig(parsedConfig)
      setIsConfigured(!!parsedConfig.businessName)
    }
  }, [])

  const handleSaveConfig = () => {
    localStorage.setItem("automatia-config", JSON.stringify(config))
    setIsConfigured(!!config.businessName)
    setConfigDialogOpen(false)
  }

  const mockMetrics = {
    conversations: 1247,
    reservations: 89,
    conversions: 67,
    responseTime: "2.3s",
  }

  const upcomingModules = [
    {
      icon: MessageSquare,
      title: "Campañas IA",
      description: "Marketing automatizado inteligente",
      status: "Próximamente",
    },
    {
      icon: BarChart3,
      title: "Dashboards & Reportes",
      description: "Análisis avanzado de datos",
      status: "Próximamente",
    },
    {
      icon: Headphones,
      title: "Soporte 360°",
      description: "Atención al cliente completa",
      status: "Próximamente",
    },
    {
      icon: Cog,
      title: "Automatización Operativa",
      description: "Procesos internos optimizados",
      status: "Próximamente",
    },
    {
      icon: DollarSign,
      title: "IA Financiera",
      description: "Gestión inteligente de finanzas",
      status: "Próximamente",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Control</h1>
          <p className="text-muted-foreground">
            Gestiona tu asistente IA y monitorea el rendimiento de tu negocio
          </p>
        </div>

        {/* Quick Stats */}
        {isConfigured && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversaciones</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockMetrics.conversations}</div>
                <p className="text-xs text-muted-foreground">+23% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reservas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockMetrics.reservations}</div>
                <p className="text-xs text-muted-foreground">+8% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockMetrics.conversions}</div>
                <p className="text-xs text-muted-foreground">+15% vs mes anterior</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Respuesta</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockMetrics.responseTime}</div>
                <p className="text-xs text-muted-foreground">Promedio últimos 30 días</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Core AI Product Card */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Tus Productos</h2>
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Automatía Core AI</CardTitle>
                    <CardDescription>Asistente Inteligente para WhatsApp y Web</CardDescription>
                  </div>
                </div>
                <Badge variant={isConfigured ? "default" : "secondary"}>
                  {isConfigured ? "Activo" : "Pendiente"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Settings className="h-4 w-4" />
                      Configurar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Configuración Completa de Automatía Core AI</DialogTitle>
                      <DialogDescription>
                        Configura todos los aspectos de tu asistente IA: información del negocio, WhatsApp Business API y parámetros de IA
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6">
                      <ChatbotConfig businessId="panel-business" />
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Play className="h-4 w-4" />
                  ▷ Ver demo
                </Button>
              </div>
              
              {!isConfigured && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Configuración pendiente</span>
                  </div>
                  <p className="text-sm text-yellow-600/80 mt-1">
                    Completa la configuración para activar tu asistente IA.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Próximos Módulos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingModules.map((module, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <module.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {module.status}
                    </Badge>
                    <Button variant="outline" size="sm" disabled className="flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      Bloqueado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Soporte</CardTitle>
                  <CardDescription>¿Necesitas ayuda?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Contactar Soporte
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Tutoriales</CardTitle>
                  <CardDescription>Aprende a usar Automatía</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Tutoriales
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Facturación</CardTitle>
                  <CardDescription>Gestiona tu suscripción</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Facturación
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

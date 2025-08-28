"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock,
  Target,
  Zap,
  Eye,
  MousePointer,
  Heart,
  AlertCircle,
  CheckCircle,
  Calendar,
  Download
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface AnalyticsData {
  period: string
  totalConversations: number
  totalMessages: number
  activeUsers: number
  responseTime: number
  satisfaction: number
  conversions: number
  topFlows: Array<{
    name: string
    executions: number
    successRate: number
  }>
  hourlyActivity: Array<{
    hour: string
    conversations: number
    messages: number
  }>
}

export default function AnalyticsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  const [analyticsData] = useState<AnalyticsData>({
    period: "7d",
    totalConversations: 1247,
    totalMessages: 8923,
    activeUsers: 156,
    responseTime: 2.3,
    satisfaction: 4.7,
    conversions: 89,
    topFlows: [
      { name: "Ventas Automáticas", executions: 234, successRate: 94.2 },
      { name: "Soporte Técnico", executions: 189, successRate: 87.6 },
      { name: "Onboarding", executions: 156, successRate: 91.8 },
      { name: "Marketing", executions: 98, successRate: 82.3 }
    ],
    hourlyActivity: [
      { hour: "00:00", conversations: 12, messages: 89 },
      { hour: "06:00", conversations: 8, messages: 45 },
      { hour: "09:00", conversations: 45, messages: 234 },
      { hour: "12:00", conversations: 67, messages: 456 },
      { hour: "15:00", conversations: 89, messages: 567 },
      { hour: "18:00", conversations: 78, messages: 445 },
      { hour: "21:00", conversations: 34, messages: 234 }
    ]
  })

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

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case '24h': return 'Últimas 24 horas'
      case '7d': return 'Últimos 7 días'
      case '30d': return 'Últimos 30 días'
      case '90d': return 'Últimos 90 días'
      default: return 'Últimos 7 días'
    }
  }

  const getSatisfactionColor = (score: number) => {
    if (score >= 4.5) return 'text-green-400'
    if (score >= 4.0) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSatisfactionIcon = (score: number) => {
    if (score >= 4.5) return <Heart className="w-5 h-5 text-green-400" />
    if (score >= 4.0) return <CheckCircle className="w-5 h-5 text-yellow-400" />
    return <AlertCircle className="w-5 h-5 text-red-400" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] to-[#1a365d] p-6">
      <div className="max-w-7xl mx-auto">
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
                <BarChart3 className="w-6 h-6 text-automatia-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-automatia-white">Analytics</h1>
                <p className="text-automatia-gold">Métricas y insights del rendimiento de tu chatbot</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32 bg-automatia-black/30 border-automatia-gold/20 text-automatia-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-automatia-black border-automatia-gold/20">
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7 días</SelectItem>
                <SelectItem value="30d">30 días</SelectItem>
                <SelectItem value="90d">90 días</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline"
              className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Period Info */}
        <div className="mb-6">
          <p className="text-automatia-white/70 text-sm">
            Mostrando datos de: <span className="text-automatia-gold font-medium">{getPeriodLabel(selectedPeriod)}</span>
          </p>
        </div>

        {/* Main Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">{analyticsData.totalConversations}</p>
              <p className="text-sm text-gray-400">Conversaciones</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">{analyticsData.activeUsers}</p>
              <p className="text-sm text-gray-400">Usuarios Activos</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">{analyticsData.conversions}</p>
              <p className="text-sm text-gray-400">Conversiones</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">{analyticsData.totalMessages}</p>
              <p className="text-sm text-gray-400">Mensajes</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardHeader>
              <CardTitle className="text-automatia-gold text-lg">Tiempo de Respuesta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-automatia-white mb-2">
                  {analyticsData.responseTime}s
                </div>
                <p className="text-gray-400 text-sm">Promedio de respuesta del chatbot</p>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">-12% vs período anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardHeader>
              <CardTitle className="text-automatia-gold text-lg">Satisfacción del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="text-4xl font-bold text-automatia-white">
                    {analyticsData.satisfaction}
                  </div>
                  <span className="text-gray-400">/5</span>
                </div>
                <p className="text-gray-400 text-sm">Calificación promedio</p>
                <div className="mt-4 flex items-center justify-center">
                  {getSatisfactionIcon(analyticsData.satisfaction)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardHeader>
              <CardTitle className="text-automatia-gold text-lg">Tasa de Conversión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-automatia-white mb-2">
                  {((analyticsData.conversions / analyticsData.totalConversations) * 100).toFixed(1)}%
                </div>
                <p className="text-gray-400 text-sm">Conversiones por conversación</p>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">+8% vs período anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Flows Performance */}
        <Card className="bg-automatia-black/50 border-automatia-gold/20 mb-8">
          <CardHeader>
            <CardTitle className="text-automatia-gold">Rendimiento de Flujos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topFlows.map((flow, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-automatia-black/30 rounded-lg border border-automatia-gold/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-automatia-gold to-automatia-gold-bright rounded-full flex items-center justify-center text-sm font-bold text-automatia-black">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-automatia-white font-medium">{flow.name}</h3>
                      <p className="text-gray-400 text-sm">{flow.executions} ejecuciones</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-automatia-gold">{flow.successRate}%</div>
                    <p className="text-gray-400 text-sm">Tasa de éxito</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Activity Chart */}
        <Card className="bg-automatia-black/50 border-automatia-gold/20 mb-8">
          <CardHeader>
            <CardTitle className="text-automatia-gold">Actividad por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.hourlyActivity.map((hour, index) => {
                const maxConversations = Math.max(...analyticsData.hourlyActivity.map(h => h.conversations))
                const height = (hour.conversations / maxConversations) * 100
                
                return (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div 
                      className="w-8 bg-gradient-to-t from-automatia-gold to-automatia-gold-bright rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-400">{hour.hour}</span>
                    <span className="text-xs text-automatia-white">{hour.conversations}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-automatia-gold/10 to-automatia-gold-bright/10 border-automatia-gold/30">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-automatia-gold to-automatia-gold-bright rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-automatia-black" />
            </div>
            <h2 className="text-2xl font-bold text-automatia-white mb-4">
              Analytics en Tiempo Real
            </h2>
            <p className="text-lg text-automatia-white mb-6">
              Monitorea el rendimiento de tu chatbot, identifica oportunidades de mejora
              y optimiza la experiencia del cliente con datos precisos.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Métricas Clave</h3>
                <p className="text-automatia-white text-sm">Conversaciones, conversiones y satisfacción</p>
              </div>
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Análisis de Flujos</h3>
                <p className="text-automatia-white text-sm">Rendimiento de cada flujo automatizado</p>
              </div>
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Patrones Temporales</h3>
                <p className="text-automatia-white text-sm">Actividad por hora y día de la semana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



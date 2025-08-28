"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Bot, 
  MessageSquare, 
  Database, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface SystemStats {
  totalUsers: number
  totalBots: number
  totalConversations: number
  totalDatasources: number
  activeBots: number
  pendingApprovals: number
  systemHealth: {
    llm: "ok" | "warning" | "error"
    database: "ok" | "warning" | "error"
    whatsapp: "ok" | "warning" | "error"
    redis: "ok" | "warning" | "error"
  }
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystemStats()
  }, [])

  const fetchSystemStats = async () => {
    try {
      setLoading(true)
      // TODO: Replace with real API call
      // const response = await fetch('/api/admin/stats')
      // const data = await response.json()
      
      // Mock data for now
      const mockStats: SystemStats = {
        totalUsers: 24,
        totalBots: 8,
        totalConversations: 1247,
        totalDatasources: 15,
        activeBots: 6,
        pendingApprovals: 3,
        systemHealth: {
          llm: "ok",
          database: "ok",
          whatsapp: "warning",
          redis: "ok"
        }
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case "ok":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Cargando estadísticas...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Error al cargar estadísticas
        </h2>
        <Button onClick={fetchSystemStats} variant="outline">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-400">
          Monitoreo y gestión del sistema Automatía
        </p>
      </div>

      {/* System Health */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.systemHealth).map(([service, status]) => (
              <div key={service} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                {getHealthIcon(status)}
                <div>
                  <div className="font-medium text-white capitalize">
                    {service}
                  </div>
                  <div className={`text-sm ${getHealthColor(status)}`}>
                    {status === "ok" ? "Operativo" : status === "warning" ? "Advertencia" : "Error"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Usuarios</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Bots Activos</p>
                <p className="text-2xl font-bold text-white">{stats.activeBots}</p>
                <p className="text-xs text-gray-500">de {stats.totalBots} total</p>
              </div>
              <Bot className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Conversaciones</p>
                <p className="text-2xl font-bold text-white">{stats.totalConversations}</p>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <TrendingUp className="w-3 h-3" />
                  +12% hoy
                </div>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Fuentes de Datos</p>
                <p className="text-2xl font-bold text-white">{stats.totalDatasources}</p>
                <p className="text-xs text-gray-500">CSV, PDF, JSON</p>
              </div>
              <Database className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Users className="w-4 h-4 mr-2" />
              Revisar Aprobaciones ({stats.pendingApprovals})
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Bot className="w-4 h-4 mr-2" />
              Activar Bots
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Database className="w-4 h-4 mr-2" />
              Gestionar Datasources
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Activity className="w-4 h-4 mr-2" />
              Ver Logs del Sistema
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white">Nuevo usuario registrado: maria@empresa.com</span>
              </div>
              <span className="text-sm text-gray-400">hace 5 min</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-white">Bot "Soporte Cliente" activado</span>
              </div>
              <span className="text-sm text-gray-400">hace 15 min</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-white">ConfigBlock "prompts.faq" enviado a revisión</span>
              </div>
              <span className="text-sm text-gray-400">hace 1 hora</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

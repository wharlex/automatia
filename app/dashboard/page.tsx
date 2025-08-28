"use client"

import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { 
  Plus, 
  MessageSquare, 
  Zap, 
  Settings, 
  BarChart3, 
  Bot, 
  Users, 
  TrendingUp, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalConversations: number
  activeConversations: number
  totalMessages: number
  responseTime: number
  satisfactionRate: number
  whatsappConnected: boolean
  aiConfigured: boolean
  totalFlows: number
  totalKnowledgeDocs: number
}

interface RecentConversation {
  id: string
  contactId: string
  channel: string
  lastMessage: string
  status: string
  updatedAt: string
}

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoadingStats(true)
      
      // Usar datos mock por ahora hasta que Firebase Admin esté configurado
      const mockStats: DashboardStats = {
        totalConversations: 24,
        activeConversations: 8,
        totalMessages: 156,
        responseTime: 2.5,
        satisfactionRate: 92,
        whatsappConnected: false,
        aiConfigured: true,
        totalFlows: 3,
        totalKnowledgeDocs: 12
      }
      
      setStats(mockStats)
      
      // Conversaciones mock
      const mockConversations: RecentConversation[] = [
        {
          id: '1',
          contactId: 'user123',
          channel: 'whatsapp',
          lastMessage: 'Hola, necesito ayuda con mi pedido',
          status: 'active',
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          contactId: 'user456',
          channel: 'webchat',
          lastMessage: '¿Cuál es el estado de mi cuenta?',
          status: 'resolved',
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]
      
      setRecentConversations(mockConversations)
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  if (loading || loadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#C5B358] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[#EAEAEA]">Cargando dashboard...</span>
          <p className="text-[#EAEAEA]/50 text-sm">Si tarda más de 10 segundos, recarga la página</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-[#EAEAEA] mb-4">Acceso requerido</h2>
        <p className="text-[#EAEAEA]/70 mb-6">Debes iniciar sesión para acceder al dashboard</p>
        <Link href="/login">
          <Button>Iniciar Sesión</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#EAEAEA]">Dashboard</h1>
          <p className="text-[#EAEAEA]/70">Bienvenido de vuelta, {user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/chatbot/configurar">
            <Button className="bg-[#C5B358] hover:bg-[#C5B358]/90 text-[#0A1C2F]">
              <Bot className="w-4 h-4 mr-2" />
              Configurar Chatbot
            </Button>
          </Link>
        </div>
      </div>

      {/* Estado del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#EAEAEA] flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {stats?.whatsappConnected ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={stats?.whatsappConnected ? "text-green-400" : "text-red-400"}>
                {stats?.whatsappConnected ? "Conectado" : "No conectado"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#EAEAEA] flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Inteligencia Artificial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {stats?.aiConfigured ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={stats?.aiConfigured ? "text-green-400" : "text-red-400"}>
                {stats?.aiConfigured ? "Configurada" : "No configurada"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#EAEAEA] flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Estado General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {stats?.whatsappConnected && stats?.aiConfigured ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-400" />
              )}
              <span className={stats?.whatsappConnected && stats?.aiConfigured ? "text-green-400" : "text-yellow-400"}>
                {stats?.whatsappConnected && stats?.aiConfigured ? "Operativo" : "Configurando"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Conversaciones Totales"
          value={stats?.totalConversations || 0}
          change="+12%"
          changeType="positive"
          icon={MessageSquare}
        />
        <KpiCard
          title="Conversaciones Activas"
          value={stats?.activeConversations || 0}
          change="+5%"
          changeType="positive"
          icon={Activity}
        />
        <KpiCard
          title="Mensajes Totales"
          value={stats?.totalMessages || 0}
          change="+18%"
          changeType="positive"
          icon={TrendingUp}
        />
        <KpiCard
          title="Tiempo de Respuesta"
          value={`${stats?.responseTime || 0}s`}
          change="-8%"
          changeType="positive"
          icon={Clock}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-automatia-gold/10 to-automatia-gold-bright/10 border-automatia-gold/30 hover:border-automatia-gold/50 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/chatbot/configurar')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-automatia-gold to-automatia-gold-bright rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-8 h-8 text-automatia-black" />
            </div>
            <h3 className="text-xl font-semibold text-automatia-white mb-2">Configurar ChatBot</h3>
            <p className="text-gray-300 text-sm">Configura proveedores LLM, canales y flujos de conversación</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/conversations')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Conversaciones</h3>
            <p className="text-gray-300 text-sm">Gestiona todas las conversaciones activas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30 hover:border-green-500/50 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/flows')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Flujos</h3>
            <p className="text-gray-300 text-sm">Crea y gestiona flujos de conversación</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/analytics')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
            <p className="text-gray-300 text-sm">Métricas y análisis de rendimiento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30 hover:border-orange-500/50 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/knowledge')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Base de Conocimiento</h3>
            <p className="text-gray-300 text-sm">Sube documentos y entrena tu chatbot</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30 hover:border-red-500/50 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/ajustes')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ajustes</h3>
            <p className="text-gray-300 text-sm">Configura tu cuenta y preferencias</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Contenido */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#0f0f0f] border-[#C5B358]/20">
          <TabsTrigger value="overview" className="text-[#EAEAEA]">Resumen</TabsTrigger>
          <TabsTrigger value="conversations" className="text-[#EAEAEA]">Conversaciones</TabsTrigger>
          <TabsTrigger value="analytics" className="text-[#EAEAEA]">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Acciones Rápidas */}
          <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
            <CardHeader>
              <CardTitle className="text-[#EAEAEA]">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/chatbot/configurar">
                  <Button className="h-20 flex-col space-y-2 w-full bg-[#C5B358] hover:bg-[#C5B358]/90 text-[#0A1C2F]">
                    <Bot className="h-6 w-6" />
                    <span>Configurar IA</span>
                  </Button>
                </Link>
                <Link href="/dashboard/chatbot/configurar">
                  <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358]/10">
                    <MessageSquare className="h-6 w-6" />
                    <span>Conectar WhatsApp</span>
                  </Button>
                </Link>
                <Link href="/dashboard/flows">
                  <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358]/10">
                    <Zap className="h-6 w-6" />
                    <span>Gestionar Flujos</span>
                  </Button>
                </Link>
                <Link href="/dashboard/knowledge">
                  <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358]/10">
                    <Settings className="h-6 w-6" />
                    <span>Base de Conocimiento</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de Configuración */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
              <CardHeader>
                <CardTitle className="text-[#EAEAEA]">Flujos de Conversación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#C5B358] mb-2">
                    {stats?.totalFlows || 0}
                  </div>
                  <p className="text-[#EAEAEA]/70">Flujos configurados</p>
                  <Link href="/dashboard/flows">
                    <Button variant="outline" className="mt-4 border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358]/10">
                      Gestionar Flujos
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
              <CardHeader>
                <CardTitle className="text-[#EAEAEA]">Base de Conocimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#C5B358] mb-2">
                    {stats?.totalKnowledgeDocs || 0}
                  </div>
                  <p className="text-[#EAEAEA]/70">Documentos disponibles</p>
                  <Link href="/dashboard/knowledge">
                    <Button variant="outline" className="mt-4 border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358]/10">
                      Gestionar Conocimiento
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-6">
          <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
            <CardHeader>
              <CardTitle className="text-[#EAEAEA]">Conversaciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentConversations.length > 0 ? (
                <div className="space-y-4">
                  {recentConversations.map((conversation) => (
                    <div key={conversation.id} className="flex items-center justify-between p-4 bg-[#0A1C2F]/50 rounded-lg border border-[#C5B358]/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#C5B358]/20 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-[#C5B358]" />
                        </div>
                        <div>
                          <p className="text-[#EAEAEA] font-medium">
                            {conversation.contactId}
                          </p>
                          <p className="text-[#EAEAEA]/70 text-sm">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                          {conversation.status}
                        </Badge>
                        <span className="text-[#EAEAEA]/50 text-sm">
                          {new Date(conversation.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-[#C5B358]/50 mx-auto mb-4" />
                  <p className="text-[#EAEAEA]/70">No hay conversaciones recientes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
              <CardHeader>
                <CardTitle className="text-[#EAEAEA]">Actividad de los Últimos 7 Días</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-[#C5B358]">
                  <BarChart3 className="h-16 w-16 opacity-50" />
                  <p className="text-[#EAEAEA]/50 ml-4">Gráfico de actividad</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
              <CardHeader>
                <CardTitle className="text-[#EAEAEA]">Distribución por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-[#C5B358]">
                  <BarChart3 className="h-16 w-16 opacity-50" />
                  <p className="text-[#EAEAEA]/50 ml-4">Gráfico de canales</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

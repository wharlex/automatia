"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Clock,
  Star,
  Target,
  Zap,
  Brain,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  UserCheck,
  MessageCircle,
  ThumbsUp,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsData {
  overview: {
    totalConversations: number
    totalMessages: number
    avgResponseTime: number
    satisfactionRate: number
    conversionRate: number
    activeUsers: number
  }
  trends: {
    conversations: Array<{ date: string; count: number }>
    messages: Array<{ date: string; count: number }>
    satisfaction: Array<{ date: string; rate: number }>
    responseTime: Array<{ date: string; time: number }>
  }
  channels: Array<{ name: string; value: number; color: string }>
  topIntents: Array<{ intent: string; count: number; accuracy: number }>
  userFlow: Array<{ step: string; users: number; dropoff: number }>
  performance: {
    uptime: number
    errorRate: number
    avgLoadTime: number
    peakHours: Array<{ hour: number; load: number }>
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Simulated data - replace with real API calls
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData: AnalyticsData = {
        overview: {
          totalConversations: 1247,
          totalMessages: 8932,
          avgResponseTime: 1.2,
          satisfactionRate: 94.5,
          conversionRate: 23.8,
          activeUsers: 342
        },
        trends: {
          conversations: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            count: Math.floor(Math.random() * 200) + 100
          })),
          messages: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            count: Math.floor(Math.random() * 1500) + 800
          })),
          satisfaction: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            rate: Math.floor(Math.random() * 10) + 90
          })),
          responseTime: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            time: Math.random() * 2 + 0.5
          }))
        },
        channels: [
          { name: 'Web Chat', value: 45, color: '#0088FE' },
          { name: 'WhatsApp', value: 30, color: '#00C49F' },
          { name: 'Telegram', value: 15, color: '#FFBB28' },
          { name: 'Email', value: 10, color: '#FF8042' }
        ],
        topIntents: [
          { intent: 'Consulta de precios', count: 342, accuracy: 96.2 },
          { intent: 'Soporte técnico', count: 289, accuracy: 94.1 },
          { intent: 'Información producto', count: 234, accuracy: 97.8 },
          { intent: 'Agendar cita', count: 198, accuracy: 92.5 },
          { intent: 'Estado de pedido', count: 156, accuracy: 95.3 }
        ],
        userFlow: [
          { step: 'Inicio conversación', users: 1000, dropoff: 0 },
          { step: 'Primer mensaje', users: 850, dropoff: 15 },
          { step: 'Respuesta bot', users: 780, dropoff: 8.2 },
          { step: 'Continuación', users: 650, dropoff: 16.7 },
          { step: 'Resolución', users: 520, dropoff: 20 },
          { step: 'Satisfacción', users: 450, dropoff: 13.5 }
        ],
        performance: {
          uptime: 99.8,
          errorRate: 0.2,
          avgLoadTime: 0.8,
          peakHours: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            load: Math.floor(Math.random() * 100) + 20
          }))
        }
      }
      
      setData(mockData)
      setLoading(false)
    }

    fetchAnalytics()
    
    if (autoRefresh) {
      const interval = setInterval(fetchAnalytics, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [timeRange, autoRefresh])

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number',
    trend = 'up'
  }: {
    title: string
    value: number
    change: number
    icon: any
    format?: 'number' | 'percentage' | 'time' | 'currency'
    trend?: 'up' | 'down' | 'neutral'
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'percentage':
          return `${val}%`
        case 'time':
          return `${val}s`
        case 'currency':
          return `$${val.toLocaleString()}`
        default:
          return val.toLocaleString()
      }
    }

    const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown
    const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">{formatValue(value)}</p>
              <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
                <TrendIcon className="w-4 h-4" />
                <span>{change > 0 ? '+' : ''}{change}%</span>
                <span className="text-muted-foreground">vs anterior</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitoreo en tiempo real de tu asistente IA</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(autoRefresh && "bg-green-50 border-green-200")}
          >
            <Activity className={cn("w-4 h-4 mr-2", autoRefresh && "animate-pulse text-green-600")} />
            Auto-refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            {timeRange}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Conversaciones"
          value={data.overview.totalConversations}
          change={12.5}
          icon={MessageSquare}
          trend="up"
        />
        <StatCard
          title="Mensajes"
          value={data.overview.totalMessages}
          change={8.2}
          icon={MessageCircle}
          trend="up"
        />
        <StatCard
          title="Tiempo Respuesta"
          value={data.overview.avgResponseTime}
          change={-5.3}
          icon={Clock}
          format="time"
          trend="up"
        />
        <StatCard
          title="Satisfacción"
          value={data.overview.satisfactionRate}
          change={2.1}
          icon={ThumbsUp}
          format="percentage"
          trend="up"
        />
        <StatCard
          title="Conversión"
          value={data.overview.conversionRate}
          change={15.7}
          icon={Target}
          format="percentage"
          trend="up"
        />
        <StatCard
          title="Usuarios Activos"
          value={data.overview.activeUsers}
          change={-3.2}
          icon={Users}
          trend="down"
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="conversations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="conversations">Conversaciones</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="channels">Canales</TabsTrigger>
          <TabsTrigger value="intents">Intenciones</TabsTrigger>
          <TabsTrigger value="flow">Flujo Usuario</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversaciones por Día</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.trends.conversations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#0088FE" 
                      fill="#0088FE" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mensajes Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.trends.messages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#00C49F" 
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tiempo de Respuesta</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.trends.responseTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}s`, 'Tiempo']} />
                    <Line 
                      type="monotone" 
                      dataKey="time" 
                      stroke="#FF8042" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carga por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.performance.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="load" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-bold text-green-600">{data.performance.uptime}%</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <Progress value={data.performance.uptime} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                    <p className="text-2xl font-bold text-red-600">{data.performance.errorRate}%</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <Progress value={data.performance.errorRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Load Time</p>
                    <p className="text-2xl font-bold text-blue-600">{data.performance.avgLoadTime}s</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.channels}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.channels.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas por Canal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.channels.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: channel.color }}
                      />
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{channel.value}%</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(data.overview.totalConversations * channel.value / 100)} conv.
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Intenciones Detectadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topIntents.map((intent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <span className="font-medium">{intent.intent}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{intent.count} consultas</span>
                          <span>•</span>
                          <span>{intent.accuracy}% precisión</span>
                        </div>
                        <Progress value={intent.accuracy} className="mt-2 h-2" />
                      </div>
                    </div>
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flujo de Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.userFlow.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{step.step}</div>
                          <div className="text-sm text-muted-foreground">
                            {step.users} usuarios
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{step.users}</div>
                        {step.dropoff > 0 && (
                          <div className="text-sm text-red-600">
                            -{step.dropoff}% abandono
                          </div>
                        )}
                      </div>
                    </div>
                    {index < data.userFlow.length - 1 && (
                      <div className="w-px h-4 bg-border ml-8 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}











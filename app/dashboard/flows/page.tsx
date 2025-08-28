"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Zap, 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  Copy,
  Eye,
  BarChart3,
  Users,
  MessageSquare,
  Target,
  TrendingUp
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Flow {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'draft'
  type: 'sales' | 'support' | 'onboarding' | 'marketing'
  triggers: string[]
  steps: number
  conversions: number
  totalInteractions: number
  createdAt: string
  lastModified: string
}

export default function FlowsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")

  const [flows] = useState<Flow[]>([
    {
      id: '1',
      name: 'Ventas Automáticas',
      description: 'Flujo completo de ventas desde lead hasta cierre',
      status: 'active',
      type: 'sales',
      triggers: ['Mensaje de interés', 'Consulta de precios'],
      steps: 8,
      conversions: 45,
      totalInteractions: 234,
      createdAt: '2025-08-20',
      lastModified: '2025-08-25'
    },
    {
      id: '2',
      name: 'Soporte Técnico',
      description: 'Atención automática a consultas técnicas',
      status: 'active',
      type: 'support',
      triggers: ['Palabras clave de error', 'Solicitud de ayuda'],
      steps: 6,
      conversions: 89,
      totalInteractions: 567,
      createdAt: '2025-08-18',
      lastModified: '2025-08-24'
    },
    {
      id: '3',
      name: 'Onboarding Clientes',
      description: 'Bienvenida y guía para nuevos clientes',
      status: 'active',
      type: 'onboarding',
      triggers: ['Primera compra', 'Registro de cuenta'],
      steps: 5,
      conversions: 156,
      totalInteractions: 789,
      createdAt: '2025-08-15',
      lastModified: '2025-08-22'
    },
    {
      id: '4',
      name: 'Marketing Promocional',
      description: 'Campañas de marketing y promociones',
      status: 'inactive',
      type: 'marketing',
      triggers: ['Abandono de carrito', 'Inactividad'],
      steps: 4,
      conversions: 23,
      totalInteractions: 123,
      createdAt: '2025-08-10',
      lastModified: '2025-08-18'
    }
  ])

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

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         flow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || flow.type === selectedType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'support': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'onboarding': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'marketing': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sales': return 'Ventas'
      case 'support': return 'Soporte'
      case 'onboarding': return 'Onboarding'
      case 'marketing': return 'Marketing'
      default: return type
    }
  }

  const handleCreateFlow = () => {
    alert('Función de crear flujo - Próximamente!')
  }

  const handleEditFlow = (flowId: string) => {
    alert(`Editando flujo ${flowId} - Próximamente!`)
  }

  const handleToggleStatus = (flowId: string, currentStatus: string) => {
    alert(`Cambiando estado del flujo ${flowId} - Próximamente!`)
  }

  const handleDuplicateFlow = (flowId: string) => {
    alert(`Duplicando flujo ${flowId} - Próximamente!`)
  }

  const handleDeleteFlow = (flowId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este flujo?')) {
      alert(`Eliminando flujo ${flowId} - Próximamente!`)
    }
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
                <Zap className="w-6 h-6 text-automatia-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-automatia-white">Flujos de Conversación</h1>
                <p className="text-automatia-gold">Crea experiencias automatizadas para tus clientes</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleCreateFlow}
            className="bg-automatia-gold text-automatia-black hover:bg-automatia-gold-bright"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Flujo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">
                {flows.filter(f => f.status === 'active').length}
              </p>
              <p className="text-sm text-gray-400">Activos</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">
                {flows.reduce((sum, f) => sum + f.conversions, 0)}
              </p>
              <p className="text-sm text-gray-400">Conversiones</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">
                {flows.reduce((sum, f) => sum + f.totalInteractions, 0)}
              </p>
              <p className="text-sm text-gray-400">Interacciones</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">
                {flows.length}
              </p>
              <p className="text-sm text-gray-400">Total Flujos</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar flujos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-automatia-black/30 border-automatia-gold/20 text-automatia-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={selectedType === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedType('all')}
              className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
            >
              Todos
            </Button>
            <Button 
              variant={selectedType === 'sales' ? 'default' : 'outline'}
              onClick={() => setSelectedType('sales')}
              className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
            >
              Ventas
            </Button>
            <Button 
              variant={selectedType === 'support' ? 'default' : 'outline'}
              onClick={() => setSelectedType('support')}
              className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
            >
              Soporte
            </Button>
            <Button 
              variant={selectedType === 'onboarding' ? 'default' : 'outline'}
              onClick={() => setSelectedType('onboarding')}
              className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
            >
              Onboarding
            </Button>
            <Button 
              variant={selectedType === 'marketing' ? 'default' : 'outline'}
              onClick={() => setSelectedType('marketing')}
              className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
            >
              Marketing
            </Button>
          </div>
        </div>

        {/* Flows List */}
        <Card className="bg-automatia-black/50 border-automatia-gold/20">
          <CardHeader>
            <CardTitle className="text-automatia-gold">Flujos Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFlows.length > 0 ? (
              <div className="space-y-4">
                {filteredFlows.map((flow) => (
                  <div key={flow.id} className="flex items-center justify-between p-4 bg-automatia-black/30 rounded-lg border border-automatia-gold/10 hover:border-automatia-gold/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-automatia-gold to-automatia-gold-bright rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-automatia-black" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-automatia-white font-medium">{flow.name}</h3>
                          <Badge className={getStatusColor(flow.status)}>
                            {flow.status === 'active' ? 'Activo' : 
                             flow.status === 'inactive' ? 'Inactivo' : 'Borrador'}
                          </Badge>
                          <Badge className={getTypeColor(flow.type)}>
                            {getTypeLabel(flow.type)}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{flow.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span className="flex items-center space-x-1">
                            <BarChart3 className="w-3 h-3" />
                            {flow.steps} pasos
                          </span>
                          <span className="flex items-center space-x-1">
                            <Target className="w-3 h-3" />
                            {flow.conversions} conversiones
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            {flow.totalInteractions} interacciones
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Triggers: {flow.triggers.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggleStatus(flow.id, flow.status)}
                        className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
                      >
                        {flow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditFlow(flow.id)}
                        className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDuplicateFlow(flow.id)}
                        className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteFlow(flow.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap className="w-16 h-16 text-automatia-gold/50 mx-auto mb-4" />
                <p className="text-automatia-white/70">No se encontraron flujos</p>
                <p className="text-gray-400 text-sm">Intenta con otra búsqueda o filtro</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-automatia-gold/10 to-automatia-gold-bright/10 border-automatia-gold/30 mt-8">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-automatia-gold to-automatia-gold-bright rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-automatia-black" />
            </div>
            <h2 className="text-2xl font-bold text-automatia-white mb-4">
              Flujos de Conversación Inteligentes
            </h2>
            <p className="text-lg text-automatia-white mb-6">
              Crea experiencias automatizadas que guíen a tus clientes desde el primer contacto
              hasta la conversión. Flujos personalizables para cada tipo de interacción.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Editor Visual</h3>
                <p className="text-automatia-white text-sm">Crea flujos arrastrando y soltando elementos</p>
              </div>
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Triggers Inteligentes</h3>
                <p className="text-automatia-white text-sm">Activa flujos basados en comportamiento del usuario</p>
              </div>
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Analytics en Tiempo Real</h3>
                <p className="text-automatia-white text-sm">Monitorea el rendimiento y optimiza tus flujos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



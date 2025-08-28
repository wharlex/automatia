"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  MessageSquare, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  Bot,
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Conversation {
  id: string
  customerName: string
  customerPhone: string
  lastMessage: string
  status: 'active' | 'resolved' | 'pending'
  priority: 'high' | 'medium' | 'low'
  lastActivity: string
  messages: number
  source: 'whatsapp' | 'chat' | 'email'
}

export default function ConversationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      customerName: 'María González',
      customerPhone: '+54 9 11 1234-5678',
      lastMessage: 'Hola, necesito información sobre los precios de sus servicios',
      status: 'active',
      priority: 'high',
      lastActivity: 'Hace 5 minutos',
      messages: 12,
      source: 'whatsapp'
    },
    {
      id: '2',
      customerName: 'Carlos Rodríguez',
      customerPhone: '+54 9 11 8765-4321',
      lastMessage: 'Perfecto, muchas gracias por la ayuda',
      status: 'resolved',
      priority: 'medium',
      lastActivity: 'Hace 2 horas',
      messages: 8,
      source: 'whatsapp'
    },
    {
      id: '3',
      customerName: 'Ana Martínez',
      customerPhone: '+54 9 11 5555-1234',
      lastMessage: '¿Cuándo puedo recibir mi pedido?',
      status: 'pending',
      priority: 'high',
      lastActivity: 'Hace 1 hora',
      messages: 15,
      source: 'chat'
    },
    {
      id: '4',
      customerName: 'Luis Pérez',
      customerPhone: '+54 9 11 9999-8888',
      lastMessage: 'Me interesa el plan premium',
      status: 'active',
      priority: 'medium',
      lastActivity: 'Hace 30 minutos',
      messages: 6,
      source: 'whatsapp'
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

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || conv.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'resolved': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />
      case 'chat': return <MessageSquare className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
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
                <MessageSquare className="w-6 h-6 text-automatia-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-automatia-white">Conversaciones</h1>
                <p className="text-automatia-gold">Gestiona todas las conversaciones de tus clientes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">
                {conversations.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-gray-400">Activas</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">
                {conversations.filter(c => c.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-400">Pendientes</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">
                {conversations.filter(c => c.status === 'resolved').length}
              </p>
              <p className="text-sm text-gray-400">Resueltas</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">
                {conversations.length}
              </p>
              <p className="text-sm text-gray-400">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-automatia-black/30 border-automatia-gold/20 text-automatia-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('all')}
              className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
            >
              Todas
            </Button>
            <Button 
              variant={selectedStatus === 'active' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('active')}
              className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
            >
              Activas
            </Button>
            <Button 
              variant={selectedStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('pending')}
              className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
            >
              Pendientes
            </Button>
            <Button 
              variant={selectedStatus === 'resolved' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('resolved')}
              className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
            >
              Resueltas
            </Button>
          </div>
        </div>

        {/* Conversations List */}
        <Card className="bg-automatia-black/50 border-automatia-gold/20">
          <CardHeader>
            <CardTitle className="text-automatia-gold">Conversaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredConversations.length > 0 ? (
              <div className="space-y-4">
                {filteredConversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-center justify-between p-4 bg-automatia-black/30 rounded-lg border border-automatia-gold/10 hover:border-automatia-gold/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-automatia-gold to-automatia-gold-bright rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-automatia-black" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-automatia-white font-medium">{conversation.customerName}</h3>
                          <Badge className={getStatusColor(conversation.status)}>
                            {conversation.status === 'active' ? 'Activa' : 
                             conversation.status === 'pending' ? 'Pendiente' : 'Resuelta'}
                          </Badge>
                          <Badge className={getPriorityColor(conversation.priority)}>
                            {conversation.priority === 'high' ? 'Alta' : 
                             conversation.priority === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">{conversation.lastMessage}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            {conversation.customerPhone}
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            {conversation.messages} mensajes
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            {conversation.lastActivity}
                          </span>
                          <span className="flex items-center space-x-1">
                            {getSourceIcon(conversation.source)}
                            {conversation.source}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10">
                        Ver Chat
                      </Button>
                      <Button variant="outline" size="sm" className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-16 h-16 text-automatia-gold/50 mx-auto mb-4" />
                <p className="text-automatia-white/70">No se encontraron conversaciones</p>
                <p className="text-gray-400 text-sm">Intenta con otra búsqueda o filtro</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-automatia-gold/10 to-automatia-gold-bright/10 border-automatia-gold/30 mt-8">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-automatia-gold to-automatia-gold-bright rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-automatia-black" />
            </div>
            <h2 className="text-2xl font-bold text-automatia-white mb-4">
              Gestión de Conversaciones Inteligente
            </h2>
            <p className="text-lg text-automatia-white mb-6">
              Monitorea, responde y analiza todas las conversaciones de tus clientes
              desde un solo lugar. Integración completa con WhatsApp Business.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Respuestas Automáticas</h3>
                <p className="text-automatia-white text-sm">IA que responde 24/7 a consultas frecuentes</p>
              </div>
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Gestión Centralizada</h3>
                <p className="text-automatia-white text-sm">Todas las conversaciones en un solo dashboard</p>
              </div>
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Análisis Avanzado</h3>
                <p className="text-automatia-white text-sm">Métricas y insights de satisfacción del cliente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



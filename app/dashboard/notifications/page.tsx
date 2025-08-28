"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bell, 
  Plus, 
  Settings, 
  Mail, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  Loader2,
  Zap,
  Users,
  Activity
} from 'lucide-react'
import { useAccessControl } from '@/hooks/useAccessControl'
import { LockedFeature } from '@/components/dashboard/LockedFeature'
import { useToast } from '@/hooks/use-toast'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'system' | 'business' | 'user' | 'security'
  status: 'unread' | 'read' | 'archived'
  createdAt: string
  readAt?: string
  metadata?: any
}

interface NotificationRule {
  id: string
  name: string
  description: string
  conditions: NotificationCondition[]
  actions: NotificationAction[]
  isActive: boolean
  createdAt: string
  lastTriggered?: string
  triggerCount: number
}

interface NotificationCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex'
  value: string
  logicalOperator?: 'and' | 'or'
}

interface NotificationAction {
  type: 'email' | 'sms' | 'webhook' | 'dashboard' | 'slack'
  config: any
}

export default function NotificationsPage() {
  const { hasAccess, isLoading } = useAccessControl()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [rules, setRules] = useState<NotificationRule[]>([])
  const [selectedRule, setSelectedRule] = useState<NotificationRule | null>(null)
  const [isCreatingRule, setIsCreatingRule] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Load data on mount
  useEffect(() => {
    if (hasAccess) {
      loadNotifications()
      loadNotificationRules()
    }
  }, [hasAccess])

  const loadNotifications = async () => {
    setIsLoadingData(true)
    try {
      // For now, generate mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Alto uso de CPU',
          message: 'El servidor está experimentando un uso de CPU superior al 80%',
          priority: 'high',
          category: 'system',
          status: 'unread',
          createdAt: '2024-01-15T10:30:00Z',
          metadata: { cpuUsage: 85, serverId: 'srv-001' }
        },
        {
          id: '2',
          type: 'success',
          title: 'Chatbot activado',
          message: 'El chatbot se ha activado exitosamente en el número +5493411234567',
          priority: 'medium',
          category: 'business',
          status: 'read',
          createdAt: '2024-01-15T09:15:00Z',
          readAt: '2024-01-15T09:20:00Z'
        },
        {
          id: '3',
          type: 'error',
          title: 'Error de conexión WhatsApp',
          message: 'No se pudo establecer conexión con la API de WhatsApp',
          priority: 'critical',
          category: 'system',
          status: 'unread',
          createdAt: '2024-01-15T08:45:00Z',
          metadata: { errorCode: 'WHATSAPP_001', retryCount: 3 }
        },
        {
          id: '4',
          type: 'info',
          title: 'Nuevo usuario registrado',
          message: 'Se ha registrado un nuevo usuario: usuario@ejemplo.com',
          priority: 'low',
          category: 'user',
          status: 'read',
          createdAt: '2024-01-15T08:00:00Z',
          readAt: '2024-01-15T08:05:00Z'
        }
      ]
      
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const loadNotificationRules = async () => {
    try {
      // For now, generate mock data
      const mockRules: NotificationRule[] = [
        {
          id: '1',
          name: 'Alerta de CPU Alta',
          description: 'Notifica cuando el uso de CPU supera el 80%',
          conditions: [
            { field: 'cpu_usage', operator: 'greater_than', value: '80' }
          ],
          actions: [
            { type: 'email', config: { to: 'admin@automatia.store', subject: 'Alerta de CPU' } },
            { type: 'dashboard', config: { priority: 'high' } }
          ],
          isActive: true,
          createdAt: '2024-01-15T00:00:00Z',
          lastTriggered: '2024-01-15T10:30:00Z',
          triggerCount: 5
        },
        {
          id: '2',
          name: 'Nuevos Usuarios',
          description: 'Notifica cuando se registra un nuevo usuario',
          conditions: [
            { field: 'event_type', operator: 'equals', value: 'user_registered' }
          ],
          actions: [
            { type: 'email', config: { to: 'admin@automatia.store', subject: 'Nuevo Usuario' } },
            { type: 'slack', config: { channel: '#notifications' } }
          ],
          isActive: true,
          createdAt: '2024-01-14T00:00:00Z',
          lastTriggered: '2024-01-15T08:00:00Z',
          triggerCount: 12
        }
      ]
      
      setRules(mockRules)
    } catch (error) {
      console.error('Error loading notification rules:', error)
    }
  }

  const createNewRule = () => {
    const newRule: NotificationRule = {
      id: `rule_${Date.now()}`,
      name: 'Nueva Regla',
      description: 'Descripción de la regla',
      conditions: [
        { field: 'event_type', operator: 'equals', value: '' }
      ],
      actions: [
        { type: 'email', config: { to: '', subject: '' } }
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
      triggerCount: 0
    }
    
    setRules([...rules, newRule])
    setSelectedRule(newRule)
    setIsCreatingRule(true)
  }

  const saveRule = async (rule: NotificationRule) => {
    try {
      // In real implementation, save to API
      const updatedRules = rules.map(r => r.id === rule.id ? rule : r)
      setRules(updatedRules)
      
      toast({
        title: "Regla guardada",
        description: "La regla de notificación se ha guardado correctamente.",
      })
      
      setIsCreatingRule(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la regla.",
        variant: "destructive"
      })
    }
  }

  const deleteRule = async (ruleId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta regla?')) {
      const updatedRules = rules.filter(rule => rule.id !== ruleId)
      setRules(updatedRules)
      
      if (selectedRule?.id === ruleId) {
        setSelectedRule(null)
      }
      
      toast({
        title: "Regla eliminada",
        description: "La regla se ha eliminado correctamente.",
      })
    }
  }

  const markAsRead = async (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return {
          ...notification,
          status: 'read' as const,
          readAt: new Date().toISOString()
        }
      }
      return notification
    })
    
    setNotifications(updatedNotifications)
  }

  const archiveNotification = async (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return {
          ...notification,
          status: 'archived' as const
        }
      }
      return notification
    })
    
    setNotifications(updatedNotifications)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Activity className="w-4 h-4 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline">Baja</Badge>
      case 'medium':
        return <Badge variant="secondary">Media</Badge>
      case 'high':
        return <Badge variant="default" className="bg-orange-500">Alta</Badge>
      case 'critical':
        return <Badge variant="destructive">Crítica</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge variant="default" className="bg-blue-500">No leída</Badge>
      case 'read':
        return <Badge variant="secondary">Leída</Badge>
      case 'archived':
        return <Badge variant="outline">Archivada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.status === filter
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  // Show loading while checking access
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // Show locked feature if user doesn't have access
  if (!hasAccess) {
    return (
      <LockedFeature 
        feature="notifications" 
        userEmail=""
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          <p className="text-muted-foreground">
            Sistema de alertas y notificaciones del chatbot
          </p>
        </div>
        
        <Button onClick={createNewRule} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear Regla
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones ({notifications.filter(n => n.status === 'unread').length})
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Reglas ({rules.length})
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar notificaciones..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="all">Todas</option>
                  <option value="unread">No leídas</option>
                  <option value="read">Leídas</option>
                  <option value="archived">Archivadas</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {isLoadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
                  <div className="text-center">
                    <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No hay notificaciones</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card key={notification.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold">{notification.title}</h3>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(notification.priority)}
                            {getStatusBadge(notification.status)}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(notification.createdAt).toLocaleString('es-ES')}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {notification.status === 'unread' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Marcar como leída
                              </Button>
                            )}
                            
                            {notification.status !== 'archived' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => archiveNotification(notification.id)}
                              >
                                <Settings className="w-4 h-4 mr-1" />
                                Archivar
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {notification.metadata && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <p className="text-xs font-medium mb-1">Metadatos:</p>
                            <pre className="text-xs text-muted-foreground">
                              {JSON.stringify(notification.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rules List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Reglas ({rules.length})
                  </CardTitle>
                  <CardDescription>
                    Reglas de notificación configuradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rules.map((rule) => (
                      <div
                        key={rule.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedRule?.id === rule.id
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedRule(rule)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {rule.name}
                            </span>
                          </div>
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {rule.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{rule.conditions.length} condiciones</span>
                          <span>{rule.actions.length} acciones</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <span>Disparada {rule.triggerCount} veces</span>
                          {rule.lastTriggered && (
                            <span>• {new Date(rule.lastTriggered).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rule Editor */}
            <div className="lg:col-span-2">
              {selectedRule ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          {selectedRule.name}
                        </CardTitle>
                        <CardDescription>
                          Editor de regla de notificación
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRule({
                              ...selectedRule,
                              isActive: !selectedRule.isActive
                            })
                          }}
                        >
                          {selectedRule.isActive ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteRule(selectedRule.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre de la Regla</label>
                        <Input
                          value={selectedRule.name}
                          onChange={(e) => setSelectedRule({
                            ...selectedRule,
                            name: e.target.value
                          })}
                          placeholder="Nombre de la regla"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción</label>
                        <Textarea
                          value={selectedRule.description}
                          onChange={(e) => setSelectedRule({
                            ...selectedRule,
                            description: e.target.value
                          })}
                          rows={3}
                          placeholder="Descripción de la regla"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Condiciones</h4>
                        <div className="space-y-3">
                          {selectedRule.conditions.map((condition, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
                              <select
                                value={condition.field}
                                onChange={(e) => {
                                  const newConditions = [...selectedRule.conditions]
                                  newConditions[index].field = e.target.value
                                  setSelectedRule({
                                    ...selectedRule,
                                    conditions: newConditions
                                  })
                                }}
                                className="p-2 border rounded-md"
                              >
                                <option value="event_type">Tipo de Evento</option>
                                <option value="cpu_usage">Uso de CPU</option>
                                <option value="memory_usage">Uso de Memoria</option>
                                <option value="error_count">Contador de Errores</option>
                                <option value="user_count">Contador de Usuarios</option>
                              </select>
                              
                              <select
                                value={condition.operator}
                                onChange={(e) => {
                                  const newConditions = [...selectedRule.conditions]
                                  newConditions[index].operator = e.target.value as any
                                  setSelectedRule({
                                    ...selectedRule,
                                    conditions: newConditions
                                  })
                                }}
                                className="p-2 border rounded-md"
                              >
                                <option value="equals">Igual a</option>
                                <option value="contains">Contiene</option>
                                <option value="greater_than">Mayor que</option>
                                <option value="less_than">Menor que</option>
                                <option value="regex">Expresión Regular</option>
                              </select>
                              
                              <Input
                                value={condition.value}
                                onChange={(e) => {
                                  const newConditions = [...selectedRule.conditions]
                                  newConditions[index].value = e.target.value
                                  setSelectedRule({
                                    ...selectedRule,
                                    conditions: newConditions
                                  })
                                }}
                                placeholder="Valor"
                                className="flex-1"
                              />
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newConditions = selectedRule.conditions.filter((_, i) => i !== index)
                                  setSelectedRule({
                                    ...selectedRule,
                                    conditions: newConditions
                                  })
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedRule({
                              ...selectedRule,
                              conditions: [...selectedRule.conditions, {
                                field: 'event_type',
                                operator: 'equals',
                                value: ''
                              }]
                            })
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Condición
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Acciones</h4>
                        <div className="space-y-3">
                          {selectedRule.actions.map((action, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
                              <select
                                value={action.type}
                                onChange={(e) => {
                                  const newActions = [...selectedRule.actions]
                                  newActions[index].type = e.target.value as any
                                  newActions[index].config = {}
                                  setSelectedRule({
                                    ...selectedRule,
                                    actions: newActions
                                  })
                                }}
                                className="p-2 border rounded-md"
                              >
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                                <option value="webhook">Webhook</option>
                                <option value="dashboard">Dashboard</option>
                                <option value="slack">Slack</option>
                              </select>
                              
                              <Input
                                value={action.config?.to || action.config?.url || ''}
                                onChange={(e) => {
                                  const newActions = [...selectedRule.actions]
                                  if (action.type === 'email') {
                                    newActions[index].config = { ...action.config, to: e.target.value }
                                  } else if (action.type === 'webhook') {
                                    newActions[index].config = { ...action.config, url: e.target.value }
                                  }
                                  setSelectedRule({
                                    ...selectedRule,
                                    actions: newActions
                                  })
                                }}
                                placeholder={action.type === 'email' ? 'Email' : 'URL'}
                                className="flex-1"
                              />
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newActions = selectedRule.actions.filter((_, i) => i !== index)
                                  setSelectedRule({
                                    ...selectedRule,
                                    actions: newActions
                                  })
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedRule({
                              ...selectedRule,
                              actions: [...selectedRule.actions, {
                                type: 'email',
                                config: { to: '', subject: '' }
                              }]
                            })
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Acción
                        </Button>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreatingRule(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => saveRule(selectedRule)}>
                          Guardar Regla
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
                    <div className="text-center">
                      <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Selecciona una regla para editarla</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}




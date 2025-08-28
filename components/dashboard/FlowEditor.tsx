"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  Play,
  Save,
  Download,
  Upload,
  Trash2,
  Copy,
  Settings,
  Plus,
  MessageSquare,
  GitBranch,
  Zap,
  Database,
  Globe,
  Phone,
  Mail,
  Calendar,
  ShoppingCart,
  Users,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  Eye,
  Code,
  Palette,
  TestTube,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  Brain,
  MessageCircle
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FlowNode {
  id: string
  type: 'start' | 'message' | 'condition' | 'action' | 'end' | 'input' | 'api' | 'delay'
  position: { x: number; y: number }
  data: {
    title: string
    content?: string
    conditions?: Array<{ condition: string; nextNode: string }>
    action?: string
    delay?: number
    apiEndpoint?: string
    inputType?: 'text' | 'email' | 'phone' | 'number' | 'date'
    validation?: string
    required?: boolean
  }
  connections: string[]
}

interface ConversationFlow {
  id: string
  name: string
  description: string
  nodes: FlowNode[]
  variables: Array<{ name: string; type: string; defaultValue?: string }>
  settings: {
    timeout: number
    fallbackMessage: string
    enableAnalytics: boolean
    enableLogging: boolean
  }
  createdAt: string
  updatedAt: string
}

const nodeTypes = [
  {
    type: 'start',
    name: 'Inicio',
    icon: Play,
    color: 'bg-green-500',
    description: 'Punto de inicio de la conversación'
  },
  {
    type: 'message',
    name: 'Mensaje',
    icon: MessageSquare,
    color: 'bg-blue-500',
    description: 'Envía un mensaje al usuario'
  },
  {
    type: 'input',
    name: 'Entrada',
    icon: User,
    color: 'bg-purple-500',
    description: 'Solicita información al usuario'
  },
  {
    type: 'condition',
    name: 'Condición',
    icon: GitBranch,
    color: 'bg-yellow-500',
    description: 'Evalúa condiciones y ramifica el flujo'
  },
  {
    type: 'action',
    name: 'Acción',
    icon: Zap,
    color: 'bg-orange-500',
    description: 'Ejecuta una acción específica'
  },
  {
    type: 'api',
    name: 'API Call',
    icon: Database,
    color: 'bg-indigo-500',
    description: 'Realiza una llamada a API externa'
  },
  {
    type: 'delay',
    name: 'Espera',
    icon: Clock,
    color: 'bg-gray-500',
    description: 'Introduce una pausa en la conversación'
  },
  {
    type: 'end',
    name: 'Fin',
    icon: Target,
    color: 'bg-red-500',
    description: 'Termina la conversación'
  }
]

const mockFlow: ConversationFlow = {
  id: "welcome-flow",
  name: "Flujo de Bienvenida",
  description: "Flujo básico de bienvenida para nuevos usuarios",
  nodes: [
    {
      id: "start-1",
      type: "start",
      position: { x: 100, y: 100 },
      data: { title: "Inicio" },
      connections: ["message-1"]
    },
    {
      id: "message-1",
      type: "message",
      position: { x: 300, y: 100 },
      data: {
        title: "Saludo",
        content: "¡Hola! Bienvenido a Automatía. ¿En qué puedo ayudarte hoy?"
      },
      connections: ["input-1"]
    },
    {
      id: "input-1",
      type: "input",
      position: { x: 500, y: 100 },
      data: {
        title: "Consulta Usuario",
        content: "Por favor, describe tu consulta:",
        inputType: "text",
        required: true
      },
      connections: ["condition-1"]
    },
    {
      id: "condition-1",
      type: "condition",
      position: { x: 700, y: 100 },
      data: {
        title: "Tipo de Consulta",
        conditions: [
          { condition: "contains('precio')", nextNode: "message-2" },
          { condition: "contains('soporte')", nextNode: "message-3" },
          { condition: "default", nextNode: "message-4" }
        ]
      },
      connections: ["message-2", "message-3", "message-4"]
    },
    {
      id: "message-2",
      type: "message",
      position: { x: 500, y: 250 },
      data: {
        title: "Respuesta Precios",
        content: "Te ayudo con información sobre precios. Nuestros planes empiezan desde $29/mes."
      },
      connections: ["end-1"]
    },
    {
      id: "message-3",
      type: "message",
      position: { x: 700, y: 250 },
      data: {
        title: "Respuesta Soporte",
        content: "Te conecto con nuestro equipo de soporte técnico."
      },
      connections: ["action-1"]
    },
    {
      id: "message-4",
      type: "message",
      position: { x: 900, y: 250 },
      data: {
        title: "Respuesta General",
        content: "Gracias por tu consulta. Un agente te contactará pronto."
      },
      connections: ["end-1"]
    },
    {
      id: "action-1",
      type: "action",
      position: { x: 700, y: 400 },
      data: {
        title: "Crear Ticket",
        action: "create_support_ticket"
      },
      connections: ["end-1"]
    },
    {
      id: "end-1",
      type: "end",
      position: { x: 700, y: 550 },
      data: { title: "Fin de Conversación" },
      connections: []
    }
  ],
  variables: [
    { name: "user_name", type: "string" },
    { name: "user_email", type: "email" },
    { name: "query_type", type: "string" }
  ],
  settings: {
    timeout: 300,
    fallbackMessage: "Lo siento, no entendí tu mensaje. ¿Podrías reformularlo?",
    enableAnalytics: true,
    enableLogging: true
  },
  createdAt: "2024-01-15",
  updatedAt: "2024-01-20"
}

export function FlowEditor() {
  const [flow, setFlow] = useState<ConversationFlow>(mockFlow)
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [connectionMode, setConnectionMode] = useState(false)
  const [connectionStart, setConnectionStart] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [testingFlow, setTestingFlow] = useState(false)
  const [currentTestNode, setCurrentTestNode] = useState<string | null>(null)
  const [testVariables, setTestVariables] = useState<Record<string, string>>({})

  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const getNodeIcon = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type)
    return nodeType?.icon || MessageSquare
  }

  const getNodeColor = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type)
    return nodeType?.color || 'bg-gray-500'
  }

  const handleNodeClick = (node: FlowNode) => {
    setSelectedNode(node)
    setIsEditing(true)
  }

  const handleNodeDragStart = (nodeId: string) => {
    setDraggedNode(nodeId)
  }

  const handleNodeDrop = (e: React.DragEvent, nodeId: string) => {
    e.preventDefault()
    if (!draggedNode) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = (e.clientX - rect.left - canvasOffset.x) / zoom
    const y = (e.clientY - rect.top - canvasOffset.y) / zoom

    setFlow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === draggedNode
          ? { ...node, position: { x, y } }
          : node
      )
    }))

    setDraggedNode(null)
  }

  const addNewNode = (type: string, position: { x: number; y: number }) => {
    const newNode: FlowNode = {
      id: `${type}-${Date.now()}`,
      type: type as FlowNode['type'],
      position,
      data: {
        title: `Nuevo ${nodeTypes.find(nt => nt.type === type)?.name || 'Nodo'}`,
        content: type === 'message' ? 'Escribe tu mensaje aquí...' : undefined
      },
      connections: []
    }

    setFlow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }))

    setSelectedNode(newNode)
    setIsEditing(true)
  }

  const updateSelectedNode = (updates: Partial<FlowNode['data']>) => {
    if (!selectedNode) return

    setFlow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    }))

    setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, ...updates } } : null)
  }

  const deleteNode = (nodeId: string) => {
    setFlow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId)
        .map(node => ({
          ...node,
          connections: node.connections.filter(conn => conn !== nodeId)
        }))
    }))

    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
      setIsEditing(false)
    }
  }

  const startConnection = (nodeId: string) => {
    setConnectionMode(true)
    setConnectionStart(nodeId)
  }

  const completeConnection = (targetNodeId: string) => {
    if (!connectionStart || connectionStart === targetNodeId) {
      setConnectionMode(false)
      setConnectionStart(null)
      return
    }

    setFlow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === connectionStart
          ? {
              ...node,
              connections: [...node.connections.filter(conn => conn !== targetNodeId), targetNodeId]
            }
          : node
      )
    }))

    setConnectionMode(false)
    setConnectionStart(null)
    toast.success("Conexión creada exitosamente")
  }

  const testFlow = async () => {
    setTestingFlow(true)
    setCurrentTestNode(flow.nodes.find(n => n.type === 'start')?.id || null)
    toast.success("Iniciando prueba del flujo...")
  }

  const saveFlow = () => {
    // Here you would implement the actual save logic
    toast.success("Flujo guardado exitosamente")
  }

  const exportFlow = () => {
    const dataStr = JSON.stringify(flow, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${flow.name.replace(/\s+/g, '_')}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success("Flujo exportado exitosamente")
  }

  const NodeComponent = ({ node }: { node: FlowNode }) => {
    const Icon = getNodeIcon(node.type)
    const isSelected = selectedNode?.id === node.id
    const isCurrentTest = currentTestNode === node.id
    
    return (
      <div
        className={cn(
          "absolute cursor-pointer group transition-all duration-200",
          isSelected && "z-10",
          isCurrentTest && "animate-pulse"
        )}
        style={{
          left: node.position.x,
          top: node.position.y,
          transform: `scale(${zoom})`
        }}
        onClick={() => handleNodeClick(node)}
        draggable
        onDragStart={() => handleNodeDragStart(node.id)}
        onDrop={(e) => handleNodeDrop(e, node.id)}
        onDragOver={(e) => e.preventDefault()}
      >
        <Card className={cn(
          "w-48 transition-all duration-200",
          isSelected && "ring-2 ring-primary shadow-lg",
          isCurrentTest && "ring-2 ring-green-500 bg-green-50",
          "group-hover:shadow-md"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("w-6 h-6 rounded flex items-center justify-center text-white text-xs", getNodeColor(node.type))}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className="font-medium text-sm truncate">{node.data.title}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {connectionMode ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      completeConnection(node.id)
                    }}
                  >
                    <Target className="w-3 h-3" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      startConnection(node.id)
                    }}
                  >
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNode(node.id)
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {node.data.content && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {node.data.content}
              </p>
            )}
            {node.connections.length > 0 && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {node.connections.length} conexión{node.connections.length !== 1 ? 'es' : ''}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const ConnectionLine = ({ from, to }: { from: FlowNode; to: FlowNode }) => {
    const startX = from.position.x + 96 // Half of node width
    const startY = from.position.y + 40 // Approximate center height
    const endX = to.position.x + 96
    const endY = to.position.y + 40

    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2

    return (
      <svg
        className="absolute top-0 left-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>
        <path
          d={`M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${midY} Q ${midX} ${endY} ${endX} ${endY}`}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    )
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Editor de Flujos</h2>
          <p className="text-sm text-muted-foreground">Diseña conversaciones inteligentes</p>
        </div>

        <Tabs defaultValue="nodes" className="h-full">
          <TabsList className="grid w-full grid-cols-3 m-2">
            <TabsTrigger value="nodes">Nodos</TabsTrigger>
            <TabsTrigger value="properties">Propiedades</TabsTrigger>
            <TabsTrigger value="settings">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="nodes" className="p-4 space-y-2">
            <h3 className="font-medium mb-3">Agregar Nodos</h3>
            <div className="grid grid-cols-2 gap-2">
              {nodeTypes.map((nodeType) => {
                const Icon = nodeType.icon
                return (
                  <Button
                    key={nodeType.type}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2"
                    onClick={() => addNewNode(nodeType.type, { x: 100, y: 100 })}
                  >
                    <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white", nodeType.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs">{nodeType.name}</span>
                  </Button>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="properties" className="p-4">
            {selectedNode ? (
              <div className="space-y-4">
                <h3 className="font-medium">Propiedades del Nodo</h3>
                
                <div>
                  <Label>Título</Label>
                  <Input
                    value={selectedNode.data.title}
                    onChange={(e) => updateSelectedNode({ title: e.target.value })}
                  />
                </div>

                {(selectedNode.type === 'message' || selectedNode.type === 'input') && (
                  <div>
                    <Label>Contenido</Label>
                    <Textarea
                      value={selectedNode.data.content || ''}
                      onChange={(e) => updateSelectedNode({ content: e.target.value })}
                      placeholder="Escribe el contenido del mensaje..."
                    />
                  </div>
                )}

                {selectedNode.type === 'input' && (
                  <>
                    <div>
                      <Label>Tipo de Entrada</Label>
                      <Select
                        value={selectedNode.data.inputType || 'text'}
                        onValueChange={(value) => updateSelectedNode({ inputType: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texto</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Teléfono</SelectItem>
                          <SelectItem value="number">Número</SelectItem>
                          <SelectItem value="date">Fecha</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedNode.data.required || false}
                        onCheckedChange={(checked) => updateSelectedNode({ required: checked })}
                      />
                      <Label>Campo requerido</Label>
                    </div>
                  </>
                )}

                {selectedNode.type === 'delay' && (
                  <div>
                    <Label>Tiempo de espera (segundos)</Label>
                    <Input
                      type="number"
                      value={selectedNode.data.delay || 1}
                      onChange={(e) => updateSelectedNode({ delay: parseInt(e.target.value) })}
                    />
                  </div>
                )}

                {selectedNode.type === 'api' && (
                  <div>
                    <Label>Endpoint de API</Label>
                    <Input
                      value={selectedNode.data.apiEndpoint || ''}
                      onChange={(e) => updateSelectedNode({ apiEndpoint: e.target.value })}
                      placeholder="https://api.ejemplo.com/endpoint"
                    />
                  </div>
                )}

                {selectedNode.type === 'condition' && (
                  <div>
                    <Label>Condiciones</Label>
                    <div className="space-y-2">
                      {(selectedNode.data.conditions || []).map((condition, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Condición"
                            value={condition.condition}
                            onChange={(e) => {
                              const newConditions = [...(selectedNode.data.conditions || [])]
                              newConditions[index] = { ...condition, condition: e.target.value }
                              updateSelectedNode({ conditions: newConditions })
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newConditions = (selectedNode.data.conditions || []).filter((_, i) => i !== index)
                              updateSelectedNode({ conditions: newConditions })
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newConditions = [
                            ...(selectedNode.data.conditions || []),
                            { condition: '', nextNode: '' }
                          ]
                          updateSelectedNode({ conditions: newConditions })
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Condición
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Selecciona un nodo para editar sus propiedades
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <h3 className="font-medium">Configuración del Flujo</h3>
            
            <div>
              <Label>Nombre del Flujo</Label>
              <Input
                value={flow.name}
                onChange={(e) => setFlow(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                value={flow.description}
                onChange={(e) => setFlow(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <Label>Timeout (segundos)</Label>
              <Input
                type="number"
                value={flow.settings.timeout}
                onChange={(e) => setFlow(prev => ({
                  ...prev,
                  settings: { ...prev.settings, timeout: parseInt(e.target.value) }
                }))}
              />
            </div>

            <div>
              <Label>Mensaje de Fallback</Label>
              <Textarea
                value={flow.settings.fallbackMessage}
                onChange={(e) => setFlow(prev => ({
                  ...prev,
                  settings: { ...prev.settings, fallbackMessage: e.target.value }
                }))}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={flow.settings.enableAnalytics}
                  onCheckedChange={(checked) => setFlow(prev => ({
                    ...prev,
                    settings: { ...prev.settings, enableAnalytics: checked }
                  }))}
                />
                <Label>Habilitar Analytics</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={flow.settings.enableLogging}
                  onCheckedChange={(checked) => setFlow(prev => ({
                    ...prev,
                    settings: { ...prev.settings, enableLogging: checked }
                  }))}
                />
                <Label>Habilitar Logging</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{flow.name}</h1>
            <Badge variant="outline">{flow.nodes.length} nodos</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={testFlow}>
              <TestTube className="w-4 h-4 mr-2" />
              Probar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Vista Previa
            </Button>
            <Button variant="outline" size="sm" onClick={exportFlow}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" onClick={saveFlow}>
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 bg-gray-50 relative overflow-hidden"
          onDrop={(e) => {
            e.preventDefault()
            const rect = canvasRef.current?.getBoundingClientRect()
            if (!rect) return
            // Handle drop on canvas
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Connection Lines */}
          {flow.nodes.map(node =>
            node.connections.map(connectionId => {
              const targetNode = flow.nodes.find(n => n.id === connectionId)
              return targetNode ? (
                <ConnectionLine
                  key={`${node.id}-${connectionId}`}
                  from={node}
                  to={targetNode}
                />
              ) : null
            })
          )}

          {/* Nodes */}
          {flow.nodes.map(node => (
            <NodeComponent key={node.id} node={node} />
          ))}

          {/* Connection Mode Overlay */}
          {connectionMode && (
            <div className="absolute inset-0 bg-blue-500/10 pointer-events-none flex items-center justify-center">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Selecciona el nodo destino para crear la conexión
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="border-t p-2 bg-muted/50 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Zoom: {Math.round(zoom * 100)}%</span>
            <span>Nodos: {flow.nodes.length}</span>
            <span>Conexiones: {flow.nodes.reduce((acc, node) => acc + node.connections.length, 0)}</span>
          </div>
          
          {connectionMode && (
            <div className="flex items-center gap-2 text-blue-600">
              <ArrowRight className="w-4 h-4" />
              Modo conexión activo
            </div>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Vista Previa del Flujo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Información del Flujo</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Nombre:</span> {flow.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Nodos:</span> {flow.nodes.length}
                </div>
                <div>
                  <span className="text-muted-foreground">Timeout:</span> {flow.settings.timeout}s
                </div>
                <div>
                  <span className="text-muted-foreground">Analytics:</span> {flow.settings.enableAnalytics ? 'Sí' : 'No'}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Estructura del Flujo</h4>
              <ScrollArea className="h-60 border rounded-lg p-3">
                {flow.nodes.map((node, index) => (
                  <div key={node.id} className="flex items-center gap-3 py-2">
                    <div className={cn("w-6 h-6 rounded flex items-center justify-center text-white text-xs", getNodeColor(node.type))}>
                      {React.createElement(getNodeIcon(node.type), { className: "w-3 h-3" })}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{node.data.title}</div>
                      {node.data.content && (
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {node.data.content}
                        </div>
                      )}
                    </div>
                    {node.connections.length > 0 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}











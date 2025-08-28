"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ConfigBlockCard, type ConfigBlock } from "@/packages/ui/ConfigBlockCard"
import { 
  CheckCircle, 
  Clock, 
  Edit3, 
  Lock, 
  FileText,
  AlertTriangle,
  Info
} from "lucide-react"

export default function ChecklistPage() {
  const { data: session } = useSession()
  const [blocks, setBlocks] = useState<ConfigBlock[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockBlocks: ConfigBlock[] = [
      {
        id: "1",
        key: "prompts.system",
        value: "Eres un asistente virtual profesional de Automatía...",
        status: "PUBLISHED",
        version: 1,
        editableByClient: false,
        lockedByAdmin: true,
        workspaceId: "ws1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        description: "Prompt del sistema que define el comportamiento del bot"
      },
      {
        id: "2",
        key: "prompts.faq",
        value: "Preguntas frecuentes sobre nuestros servicios...",
        status: "DRAFT",
        version: 2,
        editableByClient: true,
        lockedByAdmin: false,
        workspaceId: "ws1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
        description: "Preguntas frecuentes y respuestas del bot"
      },
      {
        id: "3",
        key: "datos.menu",
        value: { items: ["Producto A", "Producto B", "Producto C"] },
        status: "IN_REVIEW",
        version: 3,
        editableByClient: true,
        lockedByAdmin: false,
        workspaceId: "ws1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
        description: "Menú de productos disponibles"
      },
      {
        id: "4",
        key: "flujo.conversacion",
        value: { steps: ["saludo", "identificacion", "consulta", "despedida"] },
        status: "PUBLISHED",
        version: 1,
        editableByClient: false,
        lockedByAdmin: false,
        workspaceId: "ws1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        description: "Flujo de conversación del bot"
      }
    ]
    
    setBlocks(mockBlocks)
    setLoading(false)
  }, [])

  const editableBlocks = blocks.filter(block => block.editableByClient)
  const readOnlyBlocks = blocks.filter(block => !block.editableByClient)
  const draftBlocks = blocks.filter(block => block.status === "DRAFT")
  const inReviewBlocks = blocks.filter(block => block.status === "IN_REVIEW")
  const publishedBlocks = blocks.filter(block => block.status === "PUBLISHED")

  const handleSave = async (blockId: string, value: any) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? { ...block, value, status: "DRAFT", updatedAt: new Date().toISOString() }
          : block
      ))
      
      alert("Bloque guardado exitosamente")
    } catch (error) {
      console.error("Error saving block:", error)
      alert("Error al guardar el bloque")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (blockId: string) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? { ...block, status: "IN_REVIEW", updatedAt: new Date().toISOString() }
          : block
      ))
      
      alert("Bloque enviado a revisión")
    } catch (error) {
      console.error("Error submitting block:", error)
      alert("Error al enviar el bloque")
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (blockId: string) => {
    // Clients cannot publish blocks
    alert("Solo los administradores pueden publicar bloques")
  }

  const handleLock = async (blockId: string, lockedByAdmin: boolean, editableByClient: boolean) => {
    // Clients cannot lock blocks
    alert("Solo los administradores pueden bloquear bloques")
  }

  const handleValueChange = (blockId: string, value: any) => {
    // This is handled in the component state
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando bloques de configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Checklist de Configuración</h1>
        <p className="text-gray-600 mt-2">
          Revisa y edita los bloques de configuración de tu workspace
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Edit3 className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{draftBlocks.length}</div>
                <div className="text-sm text-gray-600">En Borrador</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{inReviewBlocks.length}</div>
                <div className="text-sm text-gray-600">En Revisión</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{publishedBlocks.length}</div>
                <div className="text-sm text-gray-600">Publicados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {blocks.filter(b => b.lockedByAdmin).length}
                </div>
                <div className="text-sm text-gray-600">Bloqueados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <h4 className="font-medium mb-1">Cómo funciona el flujo de trabajo:</h4>
              <ul className="space-y-1">
                <li>• <strong>Borrador:</strong> Puedes editar y guardar cambios</li>
                <li>• <strong>En Revisión:</strong> Los cambios están siendo revisados por administradores</li>
                <li>• <strong>Publicado:</strong> Los cambios están activos en producción</li>
                <li>• <strong>Bloqueado:</strong> Solo los administradores pueden modificar estos bloques</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="editable" className="space-y-4">
        <TabsList>
          <TabsTrigger value="editable">
            Editables ({editableBlocks.length})
          </TabsTrigger>
          <TabsTrigger value="readonly">
            Solo Lectura ({readOnlyBlocks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editable" className="space-y-4">
          {editableBlocks.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  No hay bloques editables disponibles
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {editableBlocks.map((block) => (
                <ConfigBlockCard
                  key={block.id}
                  block={block}
                  userRole="MEMBER"
                  isAdmin={false}
                  onSave={handleSave}
                  onSubmit={handleSubmit}
                  onPublish={handlePublish}
                  onLock={handleLock}
                  onValueChange={handleValueChange}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="readonly" className="space-y-4">
          {readOnlyBlocks.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  No hay bloques de solo lectura
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {readOnlyBlocks.map((block) => (
                <ConfigBlockCard
                  key={block.id}
                  block={block}
                  userRole="MEMBER"
                  isAdmin={false}
                  onSave={handleSave}
                  onSubmit={handleSubmit}
                  onPublish={handlePublish}
                  onLock={handleLock}
                  onValueChange={handleValueChange}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer Note */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              Los cambios en los bloques editables se envían automáticamente a revisión. 
              Los administradores revisarán y publicarán los cambios aprobados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface ConfigBlock {
  id: string
  key: string
  value: any
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED"
  version: number
  editableByClient: boolean
  lockedByAdmin: boolean
  workspaceId: string
  createdAt: string
  updatedAt: string
}

interface DiffView {
  before: any
  after: any
  changes: Array<{
    path: string
    type: "added" | "removed" | "modified"
    oldValue?: any
    newValue?: any
  }>
}

export default function AdminRevisionPage() {
  const params = useParams()
  const workspaceId = params.id as string
  
  const [blocks, setBlocks] = useState<ConfigBlock[]>([])
  const [selectedBlock, setSelectedBlock] = useState<ConfigBlock | null>(null)
  const [diffView, setDiffView] = useState<DiffView | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockBlocks: ConfigBlock[] = [
      {
        id: "1",
        key: "prompts.system",
        value: { message: "Eres un asistente virtual profesional..." },
        status: "IN_REVIEW",
        version: 2,
        editableByClient: false,
        lockedByAdmin: true,
        workspaceId,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "2",
        key: "datos.menu",
        value: { items: ["Producto A", "Producto B", "Producto C"] },
        status: "IN_REVIEW",
        version: 3,
        editableByClient: true,
        lockedByAdmin: false,
        workspaceId,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      }
    ]
    setBlocks(mockBlocks)
  }, [workspaceId])

  const generateDiff = (block: ConfigBlock) => {
    // Mock diff generation
    const mockDiff: DiffView = {
      before: { message: "Eres un asistente virtual..." },
      after: block.value,
      changes: [
        {
          path: "message",
          type: "modified",
          oldValue: "Eres un asistente virtual...",
          newValue: block.value.message
        }
      ]
    }
    setDiffView(mockDiff)
    setSelectedBlock(block)
  }

  const handlePublish = async (blockId: string) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? { ...block, status: "PUBLISHED" as const, version: block.version + 1 }
          : block
      ))
      
      setSelectedBlock(null)
      setDiffView(null)
    } catch (error) {
      console.error("Error publishing block:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (blockId: string) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? { ...block, status: "DRAFT" as const }
          : block
      ))
      
      setSelectedBlock(null)
      setDiffView(null)
    } catch (error) {
      console.error("Error rejecting block:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-500"
      case "IN_REVIEW": return "bg-yellow-500"
      case "PUBLISHED": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT": return "Borrador"
      case "IN_REVIEW": return "En Revisión"
      case "PUBLISHED": return "Publicado"
      default: return status
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revisión de Configuración</h1>
          <p className="text-gray-600 mt-2">
            Workspace: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{workspaceId}</span>
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pendientes de Revisión</TabsTrigger>
          <TabsTrigger value="recent">Recientemente Publicados</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {blocks.filter(block => block.status === "IN_REVIEW").length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No hay bloques pendientes de revisión
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {blocks
                .filter(block => block.status === "IN_REVIEW")
                .map(block => (
                  <Card key={block.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{block.key}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(block.status)}>
                              {getStatusText(block.status)}
                            </Badge>
                            <Badge variant="outline">v{block.version}</Badge>
                            {block.lockedByAdmin && (
                              <Badge variant="destructive">Bloqueado por Admin</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateDiff(block)}
                          >
                            Ver Cambios
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePublish(block.id)}
                            disabled={loading}
                          >
                            Publicar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(block.id)}
                            disabled={loading}
                          >
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {blocks.filter(block => block.status === "PUBLISHED").length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No hay bloques publicados recientemente
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {blocks
                .filter(block => block.status === "PUBLISHED")
                .map(block => (
                  <Card key={block.id} className="bg-green-50 border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{block.key}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(block.status)}>
                              {getStatusText(block.status)}
                            </Badge>
                            <Badge variant="outline">v{block.version}</Badge>
                            <span className="text-sm text-gray-600">
                              Publicado el {new Date(block.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Diff Viewer Modal */}
      {selectedBlock && diffView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  Cambios en {selectedBlock.key}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedBlock(null)
                    setDiffView(null)
                  }}
                >
                  Cerrar
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Versión Anterior</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                      {JSON.stringify(diffView.before, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Nueva Versión</h4>
                    <pre className="bg-blue-50 p-3 rounded text-sm overflow-auto">
                      {JSON.stringify(diffView.after, null, 2)}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Resumen de Cambios</h4>
                  <div className="space-y-2">
                    {diffView.changes.map((change, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm ${
                          change.type === "added"
                            ? "bg-green-100 text-green-800"
                            : change.type === "removed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <span className="font-medium capitalize">{change.type}</span>: {change.path}
                        {change.oldValue && (
                          <span className="ml-2 text-gray-600">
                            ({JSON.stringify(change.oldValue)} → {JSON.stringify(change.newValue)})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedBlock(null)
                      setDiffView(null)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handlePublish(selectedBlock.id)}
                    disabled={loading}
                  >
                    {loading ? "Publicando..." : "Publicar Cambios"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  FileText, 
  Table, 
  Database, 
  Eye, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Search
} from "lucide-react"
import { toast } from "sonner"

interface Datasource {
  id: string
  name: string
  type: string
  status: string
  rowsCount: number
  vectorized: boolean
  createdAt: string
  updatedAt: string
}

export default function DatosPage() {
  const [user, authLoading] = useAuthState(auth)
  const [datasources, setDatasources] = useState<Datasource[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")

  useEffect(() => {
    if (user) {
      loadDatasources()
    }
  }, [user])

  const loadDatasources = async () => {
    try {
      setLoading(true)
      const token = await user?.getIdToken()
      
      const response = await fetch('/api/datasources/upload', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDatasources(data.datasources || [])
      }
    } catch (error) {
      console.error('Error cargando datasources:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFileName(file.name)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !fileName.trim()) {
      toast.error('Selecciona un archivo y especifica un nombre')
      return
    }

    try {
      setUploading(true)
      const token = await user?.getIdToken()
      
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('name', fileName.trim())
      formData.append('type', selectedFile.type)

      const response = await fetch('/api/datasources/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Archivo subido exitosamente')
        
        // Limpiar formulario
        setSelectedFile(null)
        setFileName("")
        if (document.getElementById('file-input')) {
          (document.getElementById('file-input') as HTMLInputElement).value = ''
        }
        
        // Recargar datasources
        loadDatasources()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al subir archivo')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Error al subir archivo')
    } finally {
      setUploading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'READY':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READY':
        return <Badge className="bg-green-100 text-green-800">Listo</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case 'ERROR':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FILE':
        return <FileText className="w-5 h-5" />
      case 'URL':
        return <Database className="w-5 h-5" />
      case 'DOCS':
        return <Table className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const filteredDatasources = datasources.filter(ds =>
    ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ds.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#C5B358] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[#EAEAEA]">Cargando datos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#EAEAEA]">Base de Datos</h1>
          <p className="text-[#EAEAEA]/70">Gestiona los datos de tu negocio para el chatbot</p>
        </div>
        <Button 
          onClick={() => document.getElementById('file-input')?.click()}
          className="bg-[#C5B358] hover:bg-[#C5B358]/90 text-[#0A1C2F]"
        >
          <Upload className="w-4 h-4 mr-2" />
          Subir Archivo
        </Button>
      </div>

      {/* Upload Section */}
      <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
        <CardHeader>
          <CardTitle className="text-[#EAEAEA] flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Subir Nuevo Archivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file-input" className="text-[#EAEAEA]">
                Seleccionar Archivo
              </Label>
              <Input
                id="file-input"
                type="file"
                accept=".csv,.xls,.xlsx,.json,.pdf"
                onChange={handleFileSelect}
                className="mt-2 bg-[#0A1C2F] border-[#C5B358]/30 text-[#EAEAEA]"
              />
              <p className="text-sm text-[#EAEAEA]/50 mt-1">
                Soporta: CSV, Excel, JSON, PDF
              </p>
            </div>
            <div>
              <Label htmlFor="filename" className="text-[#EAEAEA]">
                Nombre del Dataset
              </Label>
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Ej: Menú del Restaurante"
                className="mt-2 bg-[#0A1C2F] border-[#C5B358]/30 text-[#EAEAEA]"
              />
            </div>
          </div>
          
          {selectedFile && (
            <div className="flex items-center gap-2 p-3 bg-[#0A1C2F]/50 rounded-lg border border-[#C5B358]/20">
              <FileText className="w-4 h-4 text-[#C5B358]" />
              <span className="text-[#EAEAEA] text-sm">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
          
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || !fileName.trim() || uploading}
            className="w-full bg-[#C5B358] hover:bg-[#C5B358]/90 text-[#0A1C2F] disabled:opacity-50"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Subir Archivo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Datasources List */}
      <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#EAEAEA] flex items-center gap-2">
              <Database className="w-5 h-5" />
              Datasets Disponibles
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#EAEAEA]/50" />
              <Input
                placeholder="Buscar datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-[#0A1C2F] border-[#C5B358]/30 text-[#EAEAEA]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDatasources.length > 0 ? (
            <div className="space-y-4">
              {filteredDatasources.map((datasource) => (
                <div 
                  key={datasource.id}
                  className="flex items-center justify-between p-4 bg-[#0A1C2F]/50 rounded-lg border border-[#C5B358]/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#C5B358]/20 rounded-full flex items-center justify-center">
                      {getTypeIcon(datasource.type)}
                    </div>
                    <div>
                      <h3 className="text-[#EAEAEA] font-medium">
                        {datasource.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(datasource.status)}
                        {getStatusBadge(datasource.status)}
                        <span className="text-[#EAEAEA]/50 text-sm">
                          {datasource.rowsCount} filas
                        </span>
                        {datasource.vectorized && (
                          <Badge className="bg-blue-100 text-blue-800">RAG</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358]/10">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358]/10">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Reindexar
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-500/30 text-red-500 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-[#C5B358]/50 mx-auto mb-4" />
              <p className="text-[#EAEAEA]/70 mb-2">
                {searchTerm ? 'No se encontraron datasets que coincidan con la búsqueda' : 'No hay datasets disponibles'}
              </p>
              {!searchTerm && (
                <p className="text-[#EAEAEA]/50 text-sm">
                  Sube tu primer archivo para comenzar
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
        <CardHeader>
          <CardTitle className="text-[#EAEAEA]">¿Cómo usar los datos?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[#C5B358] font-medium mb-2">Datos Tabulares (CSV, Excel, JSON)</h4>
              <p className="text-[#EAEAEA]/70 text-sm">
                Los archivos CSV, Excel y JSON se procesan automáticamente y están disponibles 
                para consultas directas en tus flujos del chatbot.
              </p>
            </div>
            <div>
              <h4 className="text-[#C5B358] font-medium mb-2">Documentos (PDF)</h4>
              <p className="text-[#EAEAEA]/70 text-sm">
                Los PDFs se extraen y se indexan para búsqueda semántica (RAG), 
                permitiendo respuestas más precisas basadas en tu documentación.
              </p>
            </div>
          </div>
          <div className="p-4 bg-[#0A1C2F]/50 rounded-lg border border-[#C5B358]/20">
            <p className="text-[#EAEAEA] text-sm">
              <strong>Tip:</strong> Usa nombres descriptivos para tus datasets (ej: "Menú Principal", "Horarios de Atención", "Precios 2024") 
              para facilitar su uso en los flujos del chatbot.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BookOpen, Upload, Search, FileText, Plus, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploaded: string
  category?: string
  description?: string
}

interface UploadForm {
  file: File | null
  category: string
  description: string
}

export default function KnowledgePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    file: null,
    category: 'general',
    description: ''
  })

  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: "Manual de Usuario.pdf", type: "PDF", size: "2.3 MB", uploaded: "2025-08-20" },
    { id: '2', name: "Políticas de Empresa.docx", type: "DOCX", size: "1.8 MB", uploaded: "2025-08-18" },
    { id: '3', name: "FAQ General.txt", type: "TXT", size: "45 KB", uploaded: "2025-08-15" },
    { id: '4', name: "Proceso de Compra.pdf", type: "PDF", size: "3.1 MB", uploaded: "2025-08-12" },
    { id: '5', name: "Contactos Importantes.xlsx", type: "XLSX", size: "890 KB", uploaded: "2025-08-10" }
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadForm(prev => ({ ...prev, file }))
    }
  }

  const handleUpload = async () => {
    if (!uploadForm.file) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', uploadForm.file)
      formData.append('category', uploadForm.category)
      formData.append('description', uploadForm.description)

      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        
        // Agregar nuevo documento a la lista
        const newDoc: Document = {
          id: result.document.id,
          name: result.document.name,
          type: uploadForm.file.type.split('/')[1].toUpperCase(),
          size: formatFileSize(uploadForm.file.size),
          uploaded: new Date().toLocaleDateString('es-AR'),
          category: uploadForm.category,
          description: uploadForm.description
        }

        setDocuments(prev => [newDoc, ...prev])
        
        // Resetear formulario
        setUploadForm({
          file: null,
          category: 'general',
          description: ''
        })
        setShowUploadForm(false)
        
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        toast({
          title: "¡Éxito!",
          description: `Documento "${result.document.name}" subido y procesado para entrenamiento del chatbot`,
        })

        // Mostrar información del entrenamiento
        if (result.trainingStatus === 'ready') {
          toast({
            title: "Entrenamiento del Chatbot",
            description: `El documento ha sido procesado en ${result.document.trainingData.chunks} chunks y está listo para entrenar tu chatbot`,
          })
        }

      } else {
        const error = await response.json()
        throw new Error(error.error || 'Error al subir el archivo')
      }

    } catch (error: any) {
      console.error('Error uploading:', error)
      toast({
        title: "Error",
        description: error.message || "No se pudo subir el archivo",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                <BookOpen className="w-6 h-6 text-automatia-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-automatia-white">Base de Conocimiento</h1>
                <p className="text-automatia-gold">Gestiona tu información para entrenar el chatbot</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Upload */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-automatia-black/30 border-automatia-gold/20 text-automatia-white"
            />
          </div>
          <Button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-automatia-gold text-automatia-black hover:bg-automatia-gold-bright"
          >
            <Upload className="w-4 h-4 mr-2" />
            {showUploadForm ? 'Cancelar' : 'Subir Documento'}
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="bg-automatia-black/50 border-automatia-gold/20 mb-8">
            <CardHeader>
              <CardTitle className="text-automatia-gold flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Subir Nuevo Documento para Entrenar el Chatbot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="file" className="text-automatia-white">Archivo</Label>
                  <Input
                    ref={fileInputRef}
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.txt,.doc,.docx,.csv,.json"
                    className="bg-automatia-black/30 border-automatia-gold/20 text-automatia-white"
                  />
                  {uploadForm.file && (
                    <div className="flex items-center space-x-2 mt-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">{uploadForm.file.name} ({formatFileSize(uploadForm.file.size)})</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="category" className="text-automatia-white">Categoría</Label>
                  <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-automatia-black/30 border-automatia-gold/20 text-automatia-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-automatia-black border-automatia-gold/20">
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="policies">Políticas</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="procedures">Procedimientos</SelectItem>
                      <SelectItem value="training">Entrenamiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-automatia-white">Descripción</Label>
                <Textarea
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-automatia-black/30 border-automatia-gold/20 text-automatia-white"
                  placeholder="Describe el contenido del documento para mejor entrenamiento del chatbot..."
                  rows={3}
                />
              </div>

              <div className="bg-automatia-gold/10 border border-automatia-gold/20 rounded-lg p-4">
                <h4 className="text-automatia-gold font-medium mb-2">🚀 Entrenamiento del Chatbot</h4>
                <p className="text-automatia-white text-sm">
                  Este documento será procesado automáticamente para entrenar tu chatbot:
                </p>
                <ul className="text-gray-300 text-sm mt-2 space-y-1">
                  <li>• Extracción de texto y contenido</li>
                  <li>• División en chunks para procesamiento</li>
                  <li>• Generación de embeddings para búsqueda semántica</li>
                  <li>• Creación de pares pregunta-respuesta</li>
                  <li>• Integración inmediata con el sistema de IA</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                  className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={!uploadForm.file || isUploading}
                  className="bg-automatia-gold text-automatia-black hover:bg-automatia-gold-bright"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Subir y Entrenar Chatbot
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">{documents.length}</p>
              <p className="text-sm text-gray-400">Documentos</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">8.2 MB</p>
              <p className="text-sm text-gray-400">Espacio Total</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Search className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">156</p>
              <p className="text-sm text-gray-400">Búsquedas</p>
            </CardContent>
          </Card>

          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-automatia-white">3</p>
              <p className="text-sm text-gray-400">Nuevos Hoy</p>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card className="bg-automatia-black/50 border-automatia-gold/20">
          <CardHeader>
            <CardTitle className="text-automatia-gold">Documentos Disponibles para Entrenamiento</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length > 0 ? (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-automatia-black/30 rounded-lg border border-automatia-gold/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-automatia-gold/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-automatia-gold" />
                      </div>
                      <div>
                        <p className="text-automatia-white font-medium">{doc.name}</p>
                        <p className="text-gray-400 text-sm">
                          {doc.type} • {doc.size} • Subido el {doc.uploaded}
                        </p>
                        {doc.description && (
                          <p className="text-gray-300 text-sm mt-1">{doc.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10">
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="border-automatia-gold text-automatia-gold hover:bg-automatia-gold/10">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 text-automatia-gold/50 mx-auto mb-4" />
                <p className="text-automatia-white/70">No se encontraron documentos</p>
                <p className="text-gray-400 text-sm">Intenta con otra búsqueda o sube un nuevo documento</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training Status */}
        <Card className="bg-gradient-to-r from-automatia-gold/10 to-automatia-gold-bright/10 border-automatia-gold/30 mt-8">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-automatia-gold to-automatia-gold-bright rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-automatia-black" />
            </div>
            <h2 className="text-2xl font-bold text-automatia-white mb-4">
              Entrenamiento del Chatbot Activo
            </h2>
            <p className="text-lg text-automatia-white mb-6">
              Cada documento que subas se procesa automáticamente para entrenar tu chatbot con IA.
              El sistema extrae información, crea embeddings y genera respuestas inteligentes.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Procesamiento Automático</h3>
                <p className="text-automatia-white text-sm">Extracción de texto y análisis de contenido</p>
              </div>
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Entrenamiento IA</h3>
                <p className="text-automatia-white text-sm">Generación de embeddings y respuestas</p>
              </div>
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <h3 className="text-automatia-gold font-medium">Integración Inmediata</h3>
                <p className="text-automatia-white text-sm">Chatbot actualizado en tiempo real</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



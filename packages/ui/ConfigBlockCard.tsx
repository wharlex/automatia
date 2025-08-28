"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Save, 
  Send, 
  CheckCircle, 
  Lock, 
  Unlock, 
  Edit3, 
  Eye,
  AlertTriangle,
  Clock,
  FileText
} from "lucide-react"

export interface ConfigBlock {
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
  description?: string
}

interface ConfigBlockCardProps {
  block: ConfigBlock
  userRole: "OWNER" | "ADMIN" | "MEMBER"
  isAdmin: boolean
  onSave: (blockId: string, value: any) => Promise<void>
  onSubmit: (blockId: string) => Promise<void>
  onPublish: (blockId: string) => Promise<void>
  onLock: (blockId: string, lockedByAdmin: boolean, editableByClient: boolean) => Promise<void>
  onValueChange: (blockId: string, value: any) => void
}

export function ConfigBlockCard({
  block,
  userRole,
  isAdmin,
  onSave,
  onSubmit,
  onPublish,
  onLock,
  onValueChange
}: ConfigBlockCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingValue, setEditingValue] = useState(block.value)
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const canEdit = block.editableByClient || isAdmin
  const canSubmit = canEdit && block.status === "DRAFT"
  const canPublish = isAdmin && block.status === "IN_REVIEW"
  const canLock = isAdmin

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "secondary"
      case "IN_REVIEW": return "default"
      case "PUBLISHED": return "default"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT": return <Edit3 className="h-4 w-4" />
      case "IN_REVIEW": return <Clock className="h-4 w-4" />
      case "PUBLISHED": return <CheckCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const handleSave = async () => {
    if (!canEdit) return
    
    setLoading(true)
    try {
      await onSave(block.id, editingValue)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving block:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    
    setLoading(true)
    try {
      await onSubmit(block.id)
    } catch (error) {
      console.error("Error submitting block:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!canPublish) return
    
    setLoading(true)
    try {
      await onPublish(block.id)
    } catch (error) {
      console.error("Error publishing block:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLock = async () => {
    if (!canLock) return
    
    setLoading(true)
    try {
      await onLock(block.id, !block.lockedByAdmin, block.editableByClient)
    } catch (error) {
      console.error("Error toggling lock:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditingValue(block.value) // Reset to original
    }
    setIsEditing(!isEditing)
  }

  const handleValueChange = (newValue: any) => {
    setEditingValue(newValue)
    onValueChange(block.id, newValue)
  }

  const renderValue = (value: any) => {
    if (typeof value === "string") {
      return (
        <div className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-md">
          {value}
        </div>
      )
    }
    
    if (typeof value === "object" && value !== null) {
      return (
        <pre className="text-sm bg-gray-50 p-3 rounded-md overflow-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      )
    }
    
    return (
      <div className="text-sm bg-gray-50 p-3 rounded-md">
        {String(value)}
      </div>
    )
  }

  return (
    <Card className={`transition-all ${block.lockedByAdmin ? 'border-orange-200 bg-orange-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {block.lockedByAdmin && <Lock className="h-4 w-4 text-orange-600" />}
              {block.key}
            </CardTitle>
            {block.description && (
              <p className="text-sm text-gray-600 mt-1">{block.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getStatusColor(block.status)} className="flex items-center gap-1">
                {getStatusIcon(block.status)}
                {block.status === "DRAFT" && "Borrador"}
                {block.status === "IN_REVIEW" && "En Revisión"}
                {block.status === "PUBLISHED" && "Publicado"}
              </Badge>
              <Badge variant="outline">v{block.version}</Badge>
              {block.editableByClient && (
                <Badge variant="secondary">Editable por Cliente</Badge>
              )}
              {block.lockedByAdmin && (
                <Badge variant="destructive">Bloqueado por Admin</Badge>
              )}
            </div>
          </div>
          
          <div className="text-right text-sm text-gray-500">
            <div>Actualizado: {new Date(block.updatedAt).toLocaleDateString()}</div>
            <div>Workspace: {block.workspaceId}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Value Display/Edit */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Valor</Label>
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditToggle}
                disabled={loading}
              >
                {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                {isEditing ? "Vista Previa" : "Editar"}
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <Textarea
              value={typeof editingValue === "string" ? editingValue : JSON.stringify(editingValue, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  handleValueChange(parsed)
                } catch {
                  handleValueChange(e.target.value)
                }
              }}
              placeholder="Ingresa el valor del bloque..."
              className="min-h-[100px] font-mono text-sm"
            />
          ) : (
            renderValue(block.value)
          )}
        </div>

        {/* Action Buttons */}
        {canEdit && (
          <div className="flex flex-wrap gap-2">
            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={loading}
                size="sm"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            )}
            
            {canSubmit && (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? "Enviando..." : "Enviar a Revisión"}
              </Button>
            )}
            
            {canPublish && (
              <Button
                onClick={handlePublish}
                disabled={loading}
                size="sm"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {loading ? "Publicando..." : "Publicar"}
              </Button>
            )}
          </div>
        )}

        {/* Advanced Controls (Admin Only) */}
        {canLock && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Controles Avanzados</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? "Ocultar" : "Mostrar"}
                </Button>
              </div>
              
              {showAdvanced && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Bloqueado por Admin</Label>
                    <Switch
                      checked={block.lockedByAdmin}
                      onCheckedChange={() => handleLock()}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Editable por Cliente</Label>
                    <Switch
                      checked={block.editableByClient}
                      onCheckedChange={() => onLock(block.id, block.lockedByAdmin, !block.editableByClient)}
                      disabled={loading}
                    />
                  </div>
                  
                  {block.lockedByAdmin && (
                    <div className="p-2 bg-orange-100 border border-orange-200 rounded-md">
                      <div className="flex items-center gap-2 text-orange-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">
                          Este bloque está bloqueado por un administrador
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Shield, 
  Plus, 
  Trash2, 
  UserCheck, 
  UserX,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAccessControl } from '@/hooks/useAccessControl'
import { useToast } from '@/hooks/use-toast'

interface AccessData {
  chatbot_access: string[]
  admin_users: string[]
  last_updated: string
}

export default function AccessControlPage() {
  const { user } = useAuth()
  const { isAdmin } = useAccessControl()
  const { toast } = useToast()
  
  const [accessData, setAccessData] = useState<AccessData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // New user inputs
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  
  // Load access data
  useEffect(() => {
    if (isAdmin && user?.email) {
      loadAccessData()
    }
  }, [isAdmin, user?.email])

  const loadAccessData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/manage-access?adminEmail=${user?.email}`)
      if (response.ok) {
        const data = await response.json()
        setAccessData(data.accessData)
      } else {
        throw new Error('Failed to load access data')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la información de acceso.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const performAction = async (action: string, userEmail: string) => {
    if (!user?.email) return
    
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/manage-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: user.email,
          action,
          userEmail
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAccessData(data.updatedAccess)
        toast({
          title: "Acción completada",
          description: data.message,
        })
        
        // Clear inputs
        setNewUserEmail('')
        setNewAdminEmail('')
      } else {
        throw new Error('Action failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la acción.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addUser = () => {
    if (!newUserEmail.trim()) return
    performAction('grant', newUserEmail.trim())
  }

  const addAdmin = () => {
    if (!newAdminEmail.trim()) return
    performAction('add_admin', newAdminEmail.trim())
  }

  const removeUser = (email: string) => {
    performAction('revoke', email)
  }

  const removeAdmin = (email: string) => {
    performAction('remove_admin', email)
  }

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>
              Solo los administradores pueden acceder a esta página.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Control de Acceso</h1>
        <p className="text-muted-foreground">
          Gestiona quién puede acceder al chatbot y quién tiene permisos de administrador.
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuarios del Chatbot
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Administradores
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Usuarios con Acceso al Chatbot
              </CardTitle>
              <CardDescription>
                Estos usuarios pueden configurar y usar el chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new user */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="newUser">Email del usuario</Label>
                  <Input
                    id="newUser"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={addUser} 
                  disabled={!newUserEmail.trim() || isSaving}
                  className="mt-6"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Agregar Usuario
                </Button>
              </div>

              {/* Users list */}
              <div className="space-y-2">
                <h4 className="font-medium">Usuarios actuales ({accessData?.chatbot_access.length || 0})</h4>
                {accessData?.chatbot_access.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{email}</span>
                      {accessData.admin_users.includes(email) && (
                        <Badge variant="secondary">Admin</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeUser(email)}
                      disabled={isSaving}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                ))}
                {(!accessData?.chatbot_access || accessData.chatbot_access.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay usuarios con acceso al chatbot.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admins Tab */}
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Administradores del Sistema
              </CardTitle>
              <CardDescription>
                Los administradores pueden gestionar el acceso de otros usuarios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new admin */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="newAdmin">Email del administrador</Label>
                  <Input
                    id="newAdmin"
                    type="email"
                    placeholder="admin@ejemplo.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={addAdmin} 
                  disabled={!newAdminEmail.trim() || isSaving}
                  className="mt-6"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Agregar Admin
                </Button>
              </div>

              {/* Admins list */}
              <div className="space-y-2">
                <h4 className="font-medium">Administradores actuales ({accessData?.admin_users.length || 0})</h4>
                {accessData?.admin_users.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{email}</span>
                      <Badge variant="default">Admin</Badge>
                    </div>
                    {email !== user?.email && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAdmin(email)}
                        disabled={isSaving}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    )}
                    {email === user?.email && (
                      <Badge variant="outline">Tú</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status and Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Última actualización</Badge>
                <span className="text-sm text-muted-foreground">
                  {accessData?.last_updated ? new Date(accessData.last_updated).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Total usuarios</Badge>
                <span className="text-sm text-muted-foreground">
                  {accessData?.chatbot_access.length || 0} usuarios con acceso
                </span>
              </div>
            </div>
            <Button onClick={loadAccessData} variant="outline" disabled={isLoading}>
              <Loader2 className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Instrucciones de Uso
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p><strong>Para agregar un usuario:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Escribe el email del usuario en el campo correspondiente</li>
            <li>Haz clic en "Agregar Usuario"</li>
            <li>El usuario podrá acceder al chatbot inmediatamente</li>
          </ul>
          <p className="mt-3"><strong>Para agregar un administrador:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Los administradores pueden gestionar el acceso de otros usuarios</li>
            <li>No puedes remover tu propio acceso de administrador</li>
            <li>Los cambios se aplican inmediatamente</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}





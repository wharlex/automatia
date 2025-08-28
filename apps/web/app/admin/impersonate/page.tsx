"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Search, User, Users, Eye, LogOut, AlertTriangle, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: "OWNER" | "ADMIN" | "MEMBER"
  workspaceId: string
  workspaceName: string
  isApproved: boolean
  lastLoginAt: string
}

interface Workspace {
  id: string
  name: string
  userCount: number
  botCount: number
  createdAt: string
}

interface ImpersonationSession {
  id: string
  adminEmail: string
  targetUserId: string
  targetUserEmail: string
  targetWorkspaceId: string
  startedAt: string
  isActive: boolean
}

export default function AdminImpersonatePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeImpersonation, setActiveImpersonation] = useState<ImpersonationSession | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockWorkspaces: Workspace[] = [
      {
        id: "ws1",
        name: "Workspace Demo",
        userCount: 5,
        botCount: 2,
        createdAt: "2024-01-01T00:00:00Z"
      },
      {
        id: "ws2",
        name: "Workspace Cliente A",
        userCount: 3,
        botCount: 1,
        createdAt: "2024-01-15T00:00:00Z"
      }
    ]
    setWorkspaces(mockWorkspaces)
    if (mockWorkspaces.length > 0) {
      setSelectedWorkspace(mockWorkspaces[0].id)
    }

    const mockUsers: User[] = [
      {
        id: "user1",
        email: "cliente1@example.com",
        name: "Cliente Uno",
        role: "MEMBER",
        workspaceId: "ws1",
        workspaceName: "Workspace Demo",
        isApproved: true,
        lastLoginAt: "2024-01-14T10:00:00Z"
      },
      {
        id: "user2",
        email: "cliente2@example.com",
        name: "Cliente Dos",
        role: "MEMBER",
        workspaceId: "ws1",
        workspaceName: "Workspace Demo",
        isApproved: false,
        lastLoginAt: "2024-01-13T15:30:00Z"
      },
      {
        id: "user3",
        email: "admin@clientea.com",
        name: "Admin Cliente A",
        role: "ADMIN",
        workspaceId: "ws2",
        workspaceName: "Workspace Cliente A",
        isApproved: true,
        lastLoginAt: "2024-01-14T09:15:00Z"
      }
    ]
    setUsers(mockUsers)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWorkspace = !selectedWorkspace || user.workspaceId === selectedWorkspace
    return matchesSearch && matchesWorkspace
  })

  const handleImpersonate = async (user: User) => {
    if (!user.isApproved) {
      alert("No puedes impersonar usuarios no aprobados")
      return
    }

    setLoading(true)
    try {
      // Mock API call to start impersonation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const session: ImpersonationSession = {
        id: Date.now().toString(),
        adminEmail: "admin@example.com", // Current admin
        targetUserId: user.id,
        targetUserEmail: user.email,
        targetWorkspaceId: user.workspaceId,
        startedAt: new Date().toISOString(),
        isActive: true
      }
      
      setActiveImpersonation(session)
      
      // In a real implementation, this would redirect to the client dashboard
      // with impersonation context
      alert(`Impersonación iniciada como ${user.email}`)
      
    } catch (error) {
      console.error("Error starting impersonation:", error)
      alert("Error al iniciar la impersonación")
    } finally {
      setLoading(false)
    }
  }

  const handleStopImpersonation = async () => {
    if (!activeImpersonation) return

    setLoading(true)
    try {
      // Mock API call to stop impersonation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setActiveImpersonation(null)
      alert("Impersonación detenida")
      
    } catch (error) {
      console.error("Error stopping impersonation:", error)
      alert("Error al detener la impersonación")
    } finally {
      setLoading(false)
    }
  }

  const handleEnterAsClient = (user: User) => {
    if (!user.isApproved) {
      alert("No puedes entrar como usuario no aprobado")
      return
    }

    // In a real implementation, this would:
    // 1. Create an impersonation session
    // 2. Set impersonation context in session/cookies
    // 3. Redirect to client dashboard
    router.push(`/dashboard?impersonate=${user.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Impersonation Banner */}
      {activeImpersonation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">
                  Modo Impersonación Activo
                </h3>
                <p className="text-sm text-yellow-700">
                  Estás viendo la aplicación como: {activeImpersonation.targetUserEmail}
                </p>
                <p className="text-xs text-yellow-600">
                  Workspace: {activeImpersonation.targetWorkspaceId} | 
                  Iniciado: {new Date(activeImpersonation.startedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              onClick={handleStopImpersonation}
              disabled={loading}
              variant="outline"
              size="sm"
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {loading ? "Deteniendo..." : "Detener Impersonación"}
            </Button>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Impersonación de Usuarios</h1>
        <p className="text-gray-600 mt-2">
          Accede a la aplicación como otros usuarios para debugging y soporte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace Selection & Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Seleccionar Workspace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="workspace-select">Workspace</Label>
                <select
                  id="workspace-select"
                  value={selectedWorkspace}
                  onChange={(e) => setSelectedWorkspace(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Todos los workspaces</option>
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name} ({ws.userCount} usuarios)
                    </option>
                  ))}
                </select>
              </div>

              {selectedWorkspace && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm">
                    <div className="font-medium">
                      {workspaces.find(ws => ws.id === selectedWorkspace)?.name}
                    </div>
                    <div className="text-gray-600">
                      {users.filter(u => u.workspaceId === selectedWorkspace).length} usuarios
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Shield className="h-5 w-5" />
                Aviso de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-orange-700">
              <ul className="space-y-2">
                <li>• Todas las acciones se registran en AuditLog</li>
                <li>• Solo usuarios aprobados pueden ser impersonados</li>
                <li>• La impersonación es visible para el usuario</li>
                <li>• Usa solo para debugging y soporte</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Usuarios Disponibles
              </CardTitle>
              <div className="flex gap-2 mt-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por email o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No se encontraron usuarios
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={user.role === "MEMBER" ? "secondary" : "default"}>
                              {user.role}
                            </Badge>
                            <Badge variant={user.isApproved ? "default" : "destructive"}>
                              {user.isApproved ? "Aprobado" : "Pendiente"}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Último login: {new Date(user.lastLoginAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEnterAsClient(user)}
                          disabled={!user.isApproved || loading}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Entrar como Cliente
                        </Button>
                        <Button
                          onClick={() => handleImpersonate(user)}
                          disabled={!user.isApproved || loading}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          Impersonar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users, 
  Bot, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

interface Membership {
  id: string
  user: {
    id: string
    email: string
    name: string
  }
  role: "OWNER" | "ADMIN" | "MEMBER"
  isApproved: boolean
  createdAt: string
  workspace: {
    id: string
    name: string
    bots: Array<{
      id: string
      name: string
      isBotActivated: boolean
    }>
  }
}

export default function AdminClientesPage() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [approvalFilter, setApprovalFilter] = useState<string>("all")

  useEffect(() => {
    fetchMemberships()
  }, [])

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      // TODO: Replace with real API call
      // const response = await fetch('/api/admin/memberships')
      // const data = await response.json()
      
      // Mock data for now
      const mockMemberships: Membership[] = [
        {
          id: "1",
          user: { id: "u1", email: "vr212563@gmail.com", name: "Valentín Rodríguez" },
          role: "OWNER",
          isApproved: true,
          createdAt: "2024-01-15T10:00:00Z",
          workspace: {
            id: "w1",
            name: "Automatía Demo",
            bots: [
              { id: "b1", name: "Soporte Cliente", isBotActivated: true },
              { id: "b2", name: "Ventas Bot", isBotActivated: false }
            ]
          }
        },
        {
          id: "2",
          user: { id: "u2", email: "maria@empresa.com", name: "María González" },
          role: "MEMBER",
          isApproved: false,
          createdAt: "2024-01-20T14:30:00Z",
          workspace: {
            id: "w1",
            name: "Automatía Demo",
            bots: [
              { id: "b1", name: "Soporte Cliente", isBotActivated: true },
              { id: "b2", name: "Ventas Bot", isBotActivated: false }
            ]
          }
        },
        {
          id: "3",
          user: { id: "u3", email: "juan@empresa.com", name: "Juan Pérez" },
          role: "ADMIN",
          isApproved: true,
          createdAt: "2024-01-18T09:15:00Z",
          workspace: {
            id: "w1",
            name: "Automatía Demo",
            bots: [
              { id: "b1", name: "Soporte Cliente", isBotActivated: true },
              { id: "b2", name: "Ventas Bot", isBotActivated: false }
            ]
          }
        }
      ]
      
      setMemberships(mockMemberships)
    } catch (error) {
      console.error("Error fetching memberships:", error)
      toast.error("Error al cargar miembros")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveMember = async (membershipId: string, isApproved: boolean) => {
    try {
      // TODO: Replace with real API call
      // await fetch('/api/admin/approve-member', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ membershipId, isApproved })
      // })
      
      // Update local state
      setMemberships(prev => prev.map(m => 
        m.id === membershipId 
          ? { ...m, isApproved } 
          : m
      ))
      
      toast.success(
        isApproved 
          ? "Miembro aprobado exitosamente" 
          : "Acceso del miembro revocado"
      )
    } catch (error) {
      console.error("Error updating member approval:", error)
      toast.error("Error al actualizar aprobación")
    }
  }

  const handleChangeRole = async (membershipId: string, newRole: string) => {
    try {
      // TODO: Replace with real API call
      // await fetch('/api/admin/change-role', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ membershipId, role: newRole })
      // })
      
      // Update local state
      setMemberships(prev => prev.map(m => 
        m.id === membershipId 
          ? { ...m, role: newRole as "OWNER" | "ADMIN" | "MEMBER" } 
          : m
      ))
      
      toast.success("Rol actualizado exitosamente")
    } catch (error) {
      console.error("Error changing role:", error)
      toast.error("Error al cambiar rol")
    }
  }

  const handleToggleBot = async (botId: string, isBotActivated: boolean) => {
    try {
      // TODO: Replace with real API call
      // await fetch('/api/admin/activate-bot', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ botId, isBotActivated })
      // })
      
      // Update local state
      setMemberships(prev => prev.map(m => ({
        ...m,
        workspace: {
          ...m.workspace,
          bots: m.workspace.bots.map(b => 
            b.id === botId 
              ? { ...b, isBotActivated } 
              : b
          )
        }
      })))
      
      toast.success(
        isBotActivated 
          ? "Bot activado exitosamente" 
          : "Bot desactivado exitosamente"
      )
    } catch (error) {
      console.error("Error toggling bot:", error)
      toast.error("Error al cambiar estado del bot")
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-red-100 text-red-800 border-red-200"
      case "ADMIN":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "MEMBER":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getApprovalStatus = (isApproved: boolean) => {
    if (isApproved) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobado</Badge>
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
    }
  }

  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = membership.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membership.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || membership.role === roleFilter
    const matchesApproval = approvalFilter === "all" || 
                           (approvalFilter === "approved" && membership.isApproved) ||
                           (approvalFilter === "pending" && !membership.isApproved)
    
    return matchesSearch && matchesRole && matchesApproval
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Cargando miembros...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Gestión de Clientes
        </h1>
        <p className="text-gray-400">
          Administra miembros del workspace, aprobaciones y activación de bots
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por email o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="OWNER">OWNER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="MEMBER">MEMBER</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="approved">Aprobados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={fetchMemberships}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Memberships List */}
      <div className="space-y-4">
        {filteredMemberships.map((membership) => (
          <Card key={membership.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {membership.user.name}
                    </h3>
                    <Badge className={getRoleColor(membership.role)}>
                      {membership.role}
                    </Badge>
                    {getApprovalStatus(membership.isApproved)}
                  </div>
                  
                  <p className="text-gray-400 mb-2">
                    {membership.user.email}
                  </p>
                  
                  <p className="text-sm text-gray-500">
                    Miembro desde: {new Date(membership.createdAt).toLocaleDateString('es-AR')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-fit">
                  {/* Approval Actions */}
                  {membership.role !== "OWNER" && (
                    <div className="flex gap-2">
                      {membership.isApproved ? (
                        <Button
                          onClick={() => handleApproveMember(membership.id, false)}
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-600/10"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Revocar Acceso
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleApproveMember(membership.id, true)}
                          variant="outline"
                          size="sm"
                          className="border-green-600 text-green-400 hover:bg-green-600/10"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Role Change */}
                  {membership.role !== "OWNER" && (
                    <Select
                      value={membership.role}
                      onValueChange={(value) => handleChangeRole(membership.id, value)}
                    >
                      <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">MEMBER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Bots Section */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Bots del Workspace
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {membership.workspace.bots.map((bot) => (
                    <div key={bot.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{bot.name}</p>
                        <p className="text-sm text-gray-400">ID: {bot.id}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={bot.isBotActivated ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {bot.isBotActivated ? "Activo" : "Inactivo"}
                        </Badge>
                        
                        <Button
                          onClick={() => handleToggleBot(bot.id, !bot.isBotActivated)}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-600"
                        >
                          {bot.isBotActivated ? "Desactivar" : "Activar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMemberships.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No se encontraron miembros
            </h3>
            <p className="text-gray-400">
              {searchTerm || roleFilter !== "all" || approvalFilter !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay miembros registrados en este workspace"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

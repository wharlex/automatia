"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Crown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter
} from "lucide-react"
import { toast } from "sonner"

interface Membership {
  id: string
  userId: string
  workspaceId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  isApproved: boolean
  user: {
    email: string
    name: string
    image: string
  }
  createdAt: string
  updatedAt: string
}

export default function UsuariosPage() {
  const [user, authLoading] = useAuthState(auth)
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (user) {
      loadMemberships()
    }
  }, [user])

  const loadMemberships = async () => {
    try {
      setLoading(true)
      const token = await user?.getIdToken()
      
      const response = await fetch('/api/workspace/members', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMemberships(data.memberships || [])
      }
    } catch (error) {
      console.error('Error cargando miembros:', error)
      toast.error('Error al cargar los miembros del workspace')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = async (membershipId: string) => {
    try {
      const token = await user?.getIdToken()
      
      const response = await fetch('/api/workspace/members/approve', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ membershipId })
      })

      if (response.ok) {
        toast.success('Usuario aprobado exitosamente')
        loadMemberships() // Recargar lista
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al aprobar usuario')
      }
    } catch (error) {
      console.error('Error approving user:', error)
      toast.error('Error al aprobar usuario')
    }
  }

  const handleRevokeUser = async (membershipId: string) => {
    try {
      const token = await user?.getIdToken()
      
      const response = await fetch('/api/workspace/members/revoke', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ membershipId })
      })

      if (response.ok) {
        toast.success('Acceso del usuario revocado exitosamente')
        loadMemberships() // Recargar lista
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al revocar acceso')
      }
    } catch (error) {
      console.error('Error revoking user:', error)
      toast.error('Error al revocar acceso')
    }
  }

  const handleChangeRole = async (membershipId: string, newRole: string) => {
    try {
      const token = await user?.getIdToken()
      
      const response = await fetch('/api/workspace/members/role', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ membershipId, role: newRole })
      })

      if (response.ok) {
        toast.success('Rol del usuario actualizado exitosamente')
        loadMemberships() // Recargar lista
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al actualizar rol')
      }
    } catch (error) {
      console.error('Error changing role:', error)
      toast.error('Error al actualizar rol')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="w-4 h-4 text-yellow-500" />
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-blue-500" />
      case 'MEMBER':
        return <Users className="w-4 h-4 text-green-500" />
      default:
        return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Badge className="bg-yellow-100 text-yellow-800">Propietario</Badge>
      case 'ADMIN':
        return <Badge className="bg-blue-100 text-blue-800">Administrador</Badge>
      case 'MEMBER':
        return <Badge className="bg-green-100 text-green-800">Miembro</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>
    }
  }

  const getStatusBadge = (isApproved: boolean) => {
    return isApproved ? (
      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Aprobado
      </Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Pendiente
      </Badge>
    )
  }

  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = membership.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membership.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === "all" || membership.role === filterRole
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "approved" && membership.isApproved) ||
                         (filterStatus === "pending" && !membership.isApproved)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const pendingApprovals = memberships.filter(m => !m.isApproved).length
  const totalMembers = memberships.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#C5B358] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[#EAEAEA]">Cargando usuarios...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#EAEAEA]">Gestión de Usuarios</h1>
          <p className="text-[#EAEAEA]/70">Administra el acceso y permisos de los miembros del workspace</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#C5B358]">{totalMembers}</div>
            <div className="text-sm text-[#EAEAEA]/70">Total</div>
          </div>
          {pendingApprovals > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{pendingApprovals}</div>
              <div className="text-sm text-[#EAEAEA]/70">Pendientes</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#EAEAEA] flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Usuarios Aprobados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {memberships.filter(m => m.isApproved).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#EAEAEA] flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Pendientes de Aprobación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {pendingApprovals}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#EAEAEA] flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {memberships.filter(m => m.role === 'ADMIN' || m.role === 'OWNER').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#EAEAEA] flex items-center gap-2">
              <Users className="w-5 h-5" />
              Miembros del Workspace
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#EAEAEA]/50" />
              <input
                type="text"
                placeholder="Buscar por email o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 bg-[#0A1C2F] border border-[#C5B358]/30 rounded-md text-[#EAEAEA] text-sm w-64"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#EAEAEA]/50" />
              <span className="text-[#EAEAEA]/70 text-sm">Filtros:</span>
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-1 bg-[#0A1C2F] border border-[#C5B358]/30 rounded-md text-[#EAEAEA] text-sm"
            >
              <option value="all">Todos los roles</option>
              <option value="OWNER">Propietario</option>
              <option value="ADMIN">Administrador</option>
              <option value="MEMBER">Miembro</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 bg-[#0A1C2F] border border-[#C5B358]/30 rounded-md text-[#EAEAEA] text-sm"
            >
              <option value="all">Todos los estados</option>
              <option value="approved">Aprobados</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMemberships.length > 0 ? (
            <div className="space-y-4">
              {filteredMemberships.map((membership) => (
                <div 
                  key={membership.id}
                  className="flex items-center justify-between p-4 bg-[#0A1C2F]/50 rounded-lg border border-[#C5B358]/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#C5B358]/20 rounded-full flex items-center justify-center">
                      {membership.user.image ? (
                        <img 
                          src={membership.user.image} 
                          alt={membership.user.name || membership.user.email}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <Users className="w-5 h-5 text-[#C5B358]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-[#EAEAEA] font-medium">
                        {membership.user.name || 'Sin nombre'}
                      </h3>
                      <p className="text-[#EAEAEA]/70 text-sm">
                        {membership.user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getRoleIcon(membership.role)}
                        {getRoleBadge(membership.role)}
                        {getStatusBadge(membership.isApproved)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!membership.isApproved && (
                      <Button 
                        onClick={() => handleApproveUser(membership.id)}
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprobar
                      </Button>
                    )}
                    
                    {membership.isApproved && (
                      <Button 
                        onClick={() => handleRevokeUser(membership.id)}
                        size="sm" 
                        variant="outline"
                        className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Revocar
                      </Button>
                    )}
                    
                    {membership.role !== 'OWNER' && (
                      <select
                        value={membership.role}
                        onChange={(e) => handleChangeRole(membership.id, e.target.value)}
                        className="px-2 py-1 bg-[#0A1C2F] border border-[#C5B358]/30 rounded text-[#EAEAEA] text-xs"
                      >
                        <option value="MEMBER">Miembro</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-[#C5B358]/50 mx-auto mb-4" />
              <p className="text-[#EAEAEA]/70 mb-2">
                {searchTerm || filterRole !== "all" || filterStatus !== "all" 
                  ? 'No se encontraron usuarios que coincidan con los filtros' 
                  : 'No hay usuarios en este workspace'}
              </p>
              {!searchTerm && filterRole === "all" && filterStatus === "all" && (
                <p className="text-[#EAEAEA]/50 text-sm">
                  Los usuarios aparecerán aquí cuando se unan al workspace
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
        <CardHeader>
          <CardTitle className="text-[#EAEAEA]">¿Cómo funciona la aprobación?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[#C5B358] font-medium mb-2">Usuarios Pendientes</h4>
              <p className="text-[#EAEAEA]/70 text-sm">
                Los usuarios nuevos aparecen como "Pendientes" hasta que un administrador 
                apruebe su acceso. Mientras tanto, no pueden usar los bots del workspace.
              </p>
            </div>
            <div>
              <h4 className="text-[#C5B358] font-medium mb-2">Roles y Permisos</h4>
              <p className="text-[#EAEAEA]/70 text-sm">
                <strong>Propietario:</strong> Control total del workspace<br/>
                <strong>Administrador:</strong> Puede aprobar usuarios y gestionar bots<br/>
                <strong>Miembro:</strong> Acceso básico a bots aprobados
              </p>
            </div>
          </div>
          <div className="p-4 bg-[#0A1C2F]/50 rounded-lg border border-[#C5B358]/20">
            <p className="text-[#EAEAEA] text-sm">
              <strong>Importante:</strong> Solo los usuarios aprobados pueden usar los chatbots. 
              Esto garantiza que solo personas autorizadas tengan acceso a tu sistema de IA.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

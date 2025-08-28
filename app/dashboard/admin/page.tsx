"use client"

import { useState, useEffect } from "react"

export const dynamic = 'force-dynamic'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Users, Settings, Shield, CheckCircle, Clock, Plus, AlertCircle } from "lucide-react"

interface AllowlistEntry {
  email: string
  features: string[]
  role: string
  createdAt: string
  appliedAt?: string
}

export default function AdminPage() {
  const [user] = useAuthState(auth)
  const [allowlist, setAllowlist] = useState<AllowlistEntry[]>([])
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserFeatures, setNewUserFeatures] = useState<string[]>([])
  const [newUserRole, setNewUserRole] = useState<"user" | "admin">("user")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const availableFeatures = ["chatbot", "lead-agent", "support-agent"]

  useEffect(() => {
    loadAllowlist()
  }, [])

  const loadAllowlist = async () => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/admin/allowlist", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setAllowlist(data.allowlist)
      }
    } catch (error) {
      console.error("Error loading allowlist:", error)
    }
  }

  const handleAddUser = async () => {
    if (!newUserEmail || newUserFeatures.length === 0) {
      setError("Email y al menos una feature son requeridos")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/admin/allowlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newUserEmail,
          features: newUserFeatures,
          role: newUserRole,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.applied ? "Usuario configurado inmediatamente" : "Usuario agregado a la lista de espera")
        setNewUserEmail("")
        setNewUserFeatures([])
        setNewUserRole("user")
        loadAllowlist()
      } else {
        setError(data.error || "Error agregando usuario")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setNewUserFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
  }

  const handleSyncClaims = async () => {
    setIsLoading(true)
    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/admin/claims/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setSuccess("Claims sincronizados correctamente")
      } else {
        setError("Error sincronizando claims")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-[#C5B358]" />
        <div>
          <h1 className="text-2xl font-bold text-[#EAEAEA]">Panel de Administración</h1>
          <p className="text-gray-400">Gestión de usuarios y permisos del sistema</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-[#0F0F0F] border-[#C5B358]/20">
          <TabsTrigger value="users" className="data-[state=active]:bg-[#C5B358] data-[state=active]:text-black">
            <Users className="w-4 h-4 mr-2" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-[#C5B358] data-[state=active]:text-black">
            <Settings className="w-4 h-4 mr-2" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Add New User */}
          <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
            <CardHeader>
              <CardTitle className="text-[#EAEAEA] flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Agregar Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-[#EAEAEA]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="usuario@ejemplo.com"
                    className="bg-[#0F0F0F] border-[#C5B358]/20 text-[#EAEAEA]"
                  />
                </div>
                <div>
                  <Label className="text-[#EAEAEA]">Rol</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 text-[#EAEAEA]">
                      <input
                        type="radio"
                        value="user"
                        checked={newUserRole === "user"}
                        onChange={(e) => setNewUserRole(e.target.value as "user" | "admin")}
                        className="text-[#C5B358]"
                      />
                      Usuario
                    </label>
                    <label className="flex items-center gap-2 text-[#EAEAEA]">
                      <input
                        type="radio"
                        value="admin"
                        checked={newUserRole === "admin"}
                        onChange={(e) => setNewUserRole(e.target.value as "user" | "admin")}
                        className="text-[#C5B358]"
                      />
                      Admin
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[#EAEAEA]">Features</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {availableFeatures.map((feature) => (
                    <label key={feature} className="flex items-center gap-2 text-[#EAEAEA]">
                      <Switch
                        checked={newUserFeatures.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <span className="capitalize">{feature.replace("-", " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-900/20 border-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">{success}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleAddUser}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black font-semibold hover:from-[#FFD700] hover:to-[#C5B358]"
              >
                {isLoading ? "Agregando..." : "Agregar Usuario"}
              </Button>
            </CardContent>
          </Card>

          {/* Allowlist */}
          <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
            <CardHeader>
              <CardTitle className="text-[#EAEAEA] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lista de Usuarios ({allowlist.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allowlist.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No hay usuarios en la lista</p>
                ) : (
                  allowlist.map((entry) => (
                    <div
                      key={entry.email}
                      className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-lg border border-[#C5B358]/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-[#EAEAEA]">{entry.email}</span>
                          <Badge
                            variant={entry.role === "admin" ? "destructive" : "secondary"}
                            className={
                              entry.role === "admin" ? "bg-red-900/20 text-red-400" : "bg-gray-700 text-gray-300"
                            }
                          >
                            {entry.role}
                          </Badge>
                          {entry.appliedAt ? (
                            <Badge className="bg-green-900/20 text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Aplicado
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-900/20 text-yellow-400">
                              <Clock className="w-3 h-3 mr-1" />
                              Pendiente
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {entry.features.map((feature) => (
                            <Badge
                              key={feature}
                              variant="outline"
                              className="text-xs border-[#C5B358]/20 text-[#C5B358]"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Creado: {new Date(entry.createdAt).toLocaleDateString("es-AR")}
                          {entry.appliedAt && ` • Aplicado: ${new Date(entry.appliedAt).toLocaleDateString("es-AR")}`}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
            <CardHeader>
              <CardTitle className="text-[#EAEAEA] flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-lg border border-[#C5B358]/20">
                <div>
                  <h3 className="font-medium text-[#EAEAEA]">Sincronizar Claims</h3>
                  <p className="text-sm text-gray-400">Aplica permisos pendientes a usuarios existentes</p>
                </div>
                <Button
                  onClick={handleSyncClaims}
                  disabled={isLoading}
                  variant="outline"
                  className="border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 bg-transparent"
                >
                  Sincronizar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[#0F0F0F] border-[#C5B358]/20">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-[#C5B358] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#EAEAEA]">{allowlist.length}</p>
                    <p className="text-sm text-gray-400">Usuarios Total</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#0F0F0F] border-[#C5B358]/20">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#EAEAEA]">{allowlist.filter((u) => u.appliedAt).length}</p>
                    <p className="text-sm text-gray-400">Activos</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#0F0F0F] border-[#C5B358]/20">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#EAEAEA]">{allowlist.filter((u) => !u.appliedAt).length}</p>
                    <p className="text-sm text-gray-400">Pendientes</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

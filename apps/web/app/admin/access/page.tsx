"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Mail, Bot, Users } from "lucide-react"

interface Bot {
  id: string
  name: string
  isBotActivated: boolean
  workspaceId: string
  provider: "GPT" | "GEMINI"
  providerModel: string
  createdAt: string
}

interface AllowedUser {
  id: string
  email: string
  botId: string
  addedAt: string
  addedBy: string
}

interface Workspace {
  id: string
  name: string
  bots: Bot[]
}

export default function AdminAccessPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("")
  const [selectedBot, setSelectedBot] = useState<string>("")
  const [newEmail, setNewEmail] = useState("")
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockWorkspaces: Workspace[] = [
      {
        id: "ws1",
        name: "Workspace Demo",
        bots: [
          {
            id: "bot1",
            name: "Bot Principal",
            isBotActivated: false,
            workspaceId: "ws1",
            provider: "GPT",
            providerModel: "gpt-4",
            createdAt: "2024-01-01T00:00:00Z"
          },
          {
            id: "bot2",
            name: "Bot Soporte",
            isBotActivated: true,
            workspaceId: "ws1",
            provider: "GEMINI",
            providerModel: "gemini-pro",
            createdAt: "2024-01-01T00:00:00Z"
          }
        ]
      }
    ]
    setWorkspaces(mockWorkspaces)
    if (mockWorkspaces.length > 0) {
      setSelectedWorkspace(mockWorkspaces[0].id)
      setSelectedBot(mockWorkspaces[0].bots[0].id)
    }
  }, [])

  const [allowedUsers, setAllowedUsers] = useState<AllowedUser[]>([
    {
      id: "1",
      email: "cliente1@example.com",
      botId: "bot1",
      addedAt: "2024-01-01T00:00:00Z",
      addedBy: "admin@example.com"
    },
    {
      id: "2",
      email: "cliente2@example.com",
      botId: "bot1",
      addedAt: "2024-01-01T00:00:00Z",
      addedBy: "admin@example.com"
    }
  ])

  const currentWorkspace = workspaces.find(ws => ws.id === selectedWorkspace)
  const currentBot = currentWorkspace?.bots.find(bot => bot.id === selectedBot)
  const currentAllowedUsers = allowedUsers.filter(user => user.botId === selectedBot)

  const handleAddEmail = async () => {
    if (!newEmail.trim() || !selectedBot) return

    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newUser: AllowedUser = {
        id: Date.now().toString(),
        email: newEmail.trim(),
        botId: selectedBot,
        addedAt: new Date().toISOString(),
        addedBy: "admin@example.com"
      }
      
      setAllowedUsers(prev => [...prev, newUser])
      setNewEmail("")
    } catch (error) {
      console.error("Error adding email:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveEmail = async (userId: string) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAllowedUsers(prev => prev.filter(user => user.id !== userId))
    } catch (error) {
      console.error("Error removing email:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBotActivation = async (botId: string, isActivated: boolean) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setWorkspaces(prev => prev.map(ws => ({
        ...ws,
        bots: ws.bots.map(bot => 
          bot.id === botId 
            ? { ...bot, isBotActivated: !isActivated }
            : bot
        )
      })))
    } catch (error) {
      console.error("Error toggling bot activation:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Acceso</h1>
        <p className="text-gray-600 mt-2">
          Administra la activación de bots y las listas de usuarios permitidos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace & Bot Selection */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Workspace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="workspace-select">Seleccionar Workspace</Label>
                <select
                  id="workspace-select"
                  value={selectedWorkspace}
                  onChange={(e) => {
                    setSelectedWorkspace(e.target.value)
                    const ws = workspaces.find(w => w.id === e.target.value)
                    if (ws?.bots.length) {
                      setSelectedBot(ws.bots[0].id)
                    }
                  }}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>

              {currentWorkspace && (
                <div>
                  <Label htmlFor="bot-select">Seleccionar Bot</Label>
                  <select
                    id="bot-select"
                    value={selectedBot}
                    onChange={(e) => setSelectedBot(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  >
                    {currentWorkspace.bots.map(bot => (
                      <option key={bot.id} value={bot.id}>
                        {bot.name} ({bot.provider})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bot Status */}
          {currentBot && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Estado del Bot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Activado</span>
                  <Switch
                    checked={currentBot.isBotActivated}
                    onCheckedChange={() => handleToggleBotActivation(currentBot.id, currentBot.isBotActivated)}
                    disabled={loading}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <div>Proveedor: {currentBot.provider}</div>
                  <div>Modelo: {currentBot.providerModel}</div>
                  <div>Creado: {new Date(currentBot.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={currentBot.isBotActivated ? "default" : "secondary"}>
                    {currentBot.isBotActivated ? "Activo" : "Inactivo"}
                  </Badge>
                  {!currentBot.isBotActivated && (
                    <span className="text-xs text-red-600">
                      Los usuarios no pueden chatear mientras el bot esté inactivo
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Allowlist Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Lista de Usuarios Permitidos
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {currentBot?.name} - {currentAllowedUsers.length} usuarios permitidos
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Email */}
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                  disabled={loading || !currentBot?.isBotActivated}
                />
                <Button
                  onClick={handleAddEmail}
                  disabled={loading || !newEmail.trim() || !currentBot?.isBotActivated}
                  className="px-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>

              {!currentBot?.isBotActivated && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    El bot debe estar activado para permitir nuevos usuarios
                  </p>
                </div>
              )}

              <Separator />

              {/* Current Allowlist */}
              <div>
                <h4 className="font-medium mb-3">Usuarios Actuales</h4>
                {currentAllowedUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No hay usuarios en la lista de permitidos
                  </p>
                ) : (
                  <div className="space-y-2">
                    {currentAllowedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="font-medium">{user.email}</div>
                            <div className="text-xs text-gray-500">
                              Agregado: {new Date(user.addedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmail(user.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

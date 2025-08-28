"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Users, HeadphonesIcon, Calendar } from "lucide-react"

interface Lead {
  id: string
  name: string
  phone?: string
  email?: string
  interest: string
  source: string
  status: string
  createdAt: string
}

interface SupportTicket {
  id: string
  userQuery: string
  category: string
  priority: string
  status: string
  source: string
  createdAt: string
}

export default function FlowsManager() {
  const [user] = useAuthState(auth)
  const [leads, setLeads] = useState<Lead[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [flowsEnabled, setFlowsEnabled] = useState({
    leadCapture: true,
    support: true,
    appointments: true,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchLeads()
      fetchTickets()
    }
  }, [user])

  const fetchLeads = async () => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/flows/leads", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error("Error fetching leads:", error)
    }
  }

  const fetchTickets = async () => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch("/api/flows/support", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setTickets(data.tickets || [])
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const token = await user?.getIdToken()
      await fetch("/api/flows/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ leadId, status }),
      })
      fetchLeads()
    } catch (error) {
      console.error("Error updating lead:", error)
    }
  }

  const getStatusBadge = (status: string, type: "lead" | "ticket") => {
    const variants = {
      new: "bg-blue-900/20 text-blue-400 border-blue-500/20",
      contacted: "bg-yellow-900/20 text-yellow-400 border-yellow-500/20",
      converted: "bg-green-900/20 text-green-400 border-green-500/20",
      open: "bg-red-900/20 text-red-400 border-red-500/20",
      resolved: "bg-green-900/20 text-green-400 border-green-500/20",
      escalated: "bg-orange-900/20 text-orange-400 border-orange-500/20",
    }

    return (
      <Badge variant="secondary" className={variants[status] || "bg-gray-900/20 text-gray-400 border-gray-500/20"}>
        {status}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#C5B358] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[#EAEAEA]">Cargando flows...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA] mb-2">Flows Automáticos</h2>
          <p className="text-gray-400">Gestiona leads, soporte y citas automáticamente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-[#C5B358]" />
                <div>
                  <h3 className="font-semibold text-[#EAEAEA]">Lead Capture</h3>
                  <p className="text-sm text-gray-400">Captura automática</p>
                </div>
              </div>
              <Switch
                checked={flowsEnabled.leadCapture}
                onCheckedChange={(checked) => setFlowsEnabled((prev) => ({ ...prev, leadCapture: checked }))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Nuevos leads</span>
                <span className="text-[#EAEAEA] font-semibold">{leads.filter((l) => l.status === "new").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Contactados</span>
                <span className="text-[#EAEAEA] font-semibold">
                  {leads.filter((l) => l.status === "contacted").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <HeadphonesIcon className="w-8 h-8 text-[#C5B358]" />
                <div>
                  <h3 className="font-semibold text-[#EAEAEA]">Soporte</h3>
                  <p className="text-sm text-gray-400">Resolución automática</p>
                </div>
              </div>
              <Switch
                checked={flowsEnabled.support}
                onCheckedChange={(checked) => setFlowsEnabled((prev) => ({ ...prev, support: checked }))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Tickets abiertos</span>
                <span className="text-[#EAEAEA] font-semibold">
                  {tickets.filter((t) => t.status === "open").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Resueltos</span>
                <span className="text-[#EAEAEA] font-semibold">
                  {tickets.filter((t) => t.status === "resolved").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-[#C5B358]" />
                <div>
                  <h3 className="font-semibold text-[#EAEAEA]">Citas</h3>
                  <p className="text-sm text-gray-400">Agendado automático</p>
                </div>
              </div>
              <Switch
                checked={flowsEnabled.appointments}
                onCheckedChange={(checked) => setFlowsEnabled((prev) => ({ ...prev, appointments: checked }))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Este mes</span>
                <span className="text-[#EAEAEA] font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Pendientes</span>
                <span className="text-[#EAEAEA] font-semibold">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-[#0F0F0F] border border-[#C5B358]/20">
          <TabsTrigger
            value="leads"
            className="data-[state=active]:bg-[#C5B358] data-[state=active]:text-black text-[#EAEAEA]"
          >
            <Users className="w-4 h-4 mr-2" />
            Leads ({leads.length})
          </TabsTrigger>
          <TabsTrigger
            value="support"
            className="data-[state=active]:bg-[#C5B358] data-[state=active]:text-black text-[#EAEAEA]"
          >
            <HeadphonesIcon className="w-4 h-4 mr-2" />
            Soporte ({tickets.length})
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="data-[state=active]:bg-[#C5B358] data-[state=active]:text-black text-[#EAEAEA]"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Citas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          {leads.length === 0 ? (
            <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#EAEAEA] mb-2">No hay leads aún</h3>
                <p className="text-gray-400">Los leads capturados aparecerán aquí automáticamente</p>
              </CardContent>
            </Card>
          ) : (
            leads.map((lead) => (
              <Card key={lead.id} className="bg-[#0A1C2F] border-[#C5B358]/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">{lead.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#EAEAEA]">{lead.name}</h3>
                        <p className="text-sm text-gray-400">Interés: {lead.interest}</p>
                        <p className="text-xs text-gray-500">
                          {lead.phone && `Tel: ${lead.phone} • `}
                          {lead.email && `Email: ${lead.email} • `}
                          Fuente: {lead.source}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(lead.status, "lead")}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateLeadStatus(lead.id, "contacted")}
                          className="border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10"
                        >
                          Contactar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateLeadStatus(lead.id, "converted")}
                          className="bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black hover:from-[#FFD700] hover:to-[#C5B358]"
                        >
                          Convertir
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          {tickets.length === 0 ? (
            <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
              <CardContent className="p-8 text-center">
                <HeadphonesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#EAEAEA] mb-2">No hay tickets de soporte</h3>
                <p className="text-gray-400">Los tickets de soporte aparecerán aquí automáticamente</p>
              </CardContent>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="bg-[#0A1C2F] border-[#C5B358]/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <HeadphonesIcon className="w-5 h-5 text-[#C5B358]" />
                        <h3 className="font-semibold text-[#EAEAEA]">Ticket #{ticket.id.slice(-6)}</h3>
                        {getStatusBadge(ticket.status, "ticket")}
                      </div>
                      <p className="text-[#EAEAEA] mb-2">{ticket.userQuery}</p>
                      <p className="text-sm text-gray-400">
                        Categoría: {ticket.category} • Prioridad: {ticket.priority} • Fuente: {ticket.source}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 bg-transparent"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#EAEAEA] mb-2">Sistema de Citas</h3>
              <p className="text-gray-400 mb-4">
                El sistema de citas redirige automáticamente a tu calendario o agenda una llamada de seguimiento
              </p>
              <Button className="bg-gradient-to-r from-[#C5B358] to-[#FFD700] text-black hover:from-[#FFD700] hover:to-[#C5B358]">
                Configurar Calendario
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

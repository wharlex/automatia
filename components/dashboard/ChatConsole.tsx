"use client"

import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, TrendingUp, Settings, Play, BarChart3 } from "lucide-react"
import { ChatBox } from "./ChatBox"

export default function ChatConsole() {
  const [user] = useAuthState(auth)
  const [activeTab, setActiveTab] = useState("chat")
  const [stats, setStats] = useState({
    conversationsToday: 12,
    avgResponseTime: "2.3min",
    satisfaction: "94%",
    leadsGenerated: 8,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA] mb-2">Consola del Chatbot</h2>
          <p className="text-gray-400">Monitoreá y probá tu asistente de IA</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Operativo
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="border-[#C5B358]/20 text-[#EAEAEA] hover:bg-[#C5B358]/10 bg-transparent"
          >
            <Play className="w-4 h-4 mr-2" />
            Demo Completo
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-[#0F0F0F] border border-[#C5B358]/20">
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-[#C5B358] data-[state=active]:text-black text-[#EAEAEA]"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat en Vivo
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-[#C5B358] data-[state=active]:text-black text-[#EAEAEA]"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analíticas
          </TabsTrigger>
          <TabsTrigger
            value="conversations"
            className="data-[state=active]:bg-[#C5B358] data-[state=active]:text-black text-[#EAEAEA]"
          >
            <Users className="w-4 h-4 mr-2" />
            Conversaciones
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-[#C5B358] data-[state=active]:text-black text-[#EAEAEA]"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[#EAEAEA] text-lg">Estadísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Conversaciones hoy</span>
                    <span className="text-[#EAEAEA] font-semibold">{stats.conversationsToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Tiempo promedio</span>
                    <span className="text-[#EAEAEA] font-semibold">{stats.avgResponseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Satisfacción</span>
                    <span className="text-green-400 font-semibold">{stats.satisfaction}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Leads generados</span>
                    <span className="text-[#C5B358] font-semibold">{stats.leadsGenerated}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[#EAEAEA] text-lg">Estado del Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">LLM</span>
                    <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-500/20">
                      Conectado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">WhatsApp</span>
                    <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-500/20">
                      Activo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Web Widget</span>
                    <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-500/20">
                      Activo
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="bg-[#0A1C2F] border-[#C5B358]/20 h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#EAEAEA] text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#C5B358]" />
                    Prueba en Tiempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-6 pb-6">
                    <ChatBox />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Conversaciones</p>
                    <p className="text-2xl font-bold text-[#EAEAEA]">247</p>
                    <p className="text-green-400 text-sm">+12% vs ayer</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-[#C5B358]" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Leads</p>
                    <p className="text-2xl font-bold text-[#EAEAEA]">89</p>
                    <p className="text-green-400 text-sm">+23% vs ayer</p>
                  </div>
                  <Users className="w-8 h-8 text-[#C5B358]" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Satisfacción</p>
                    <p className="text-2xl font-bold text-[#EAEAEA]">94.2%</p>
                    <p className="text-green-400 text-sm">+2.1% vs ayer</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#C5B358]" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Tiempo Ahorrado</p>
                    <p className="text-2xl font-bold text-[#EAEAEA]">156h</p>
                    <p className="text-green-400 text-sm">+8% vs ayer</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-[#C5B358]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-6">
          <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
            <CardHeader>
              <CardTitle className="text-[#EAEAEA]">Conversaciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-lg border border-[#C5B358]/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#C5B358] to-[#FFD700] rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">U</span>
                      </div>
                      <div>
                        <p className="text-[#EAEAEA] font-medium">Usuario #{i}</p>
                        <p className="text-gray-400 text-sm">Hace {i * 2} minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-[#C5B358]/20 text-[#C5B358]">
                        WhatsApp
                      </Badge>
                      <Badge variant="secondary" className="bg-green-900/20 text-green-400 border-green-500/20">
                        Resuelto
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-[#0A1C2F] border-[#C5B358]/20">
            <CardHeader>
              <CardTitle className="text-[#EAEAEA]">Configuración Rápida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-400">
                <p>Las configuraciones avanzadas están disponibles en el wizard de configuración.</p>
                <p className="mt-2">Desde aquí podés monitorear el estado y hacer ajustes básicos.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

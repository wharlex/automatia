"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChatbotConfig from "@/components/dashboard/ChatbotConfig"
import BotLogs from "@/components/dashboard/BotLogs"
import { LockedFeature } from "@/components/dashboard/LockedFeature"
import { useAuth } from "@/hooks/useAuth"
import { useAccessControl } from "@/hooks/useAccessControl"
import { Loader2 } from "lucide-react"

export default function ChatbotDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const { hasAccess, isLoading } = useAccessControl()

  // Show loading while checking access
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // Show locked feature if user doesn't have access
  if (!hasAccess) {
    return (
      <LockedFeature 
        feature="chatbot" 
        userEmail={user?.email}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chatbot de WhatsApp</h1>
        <p className="text-muted-foreground">
          Configura y monitorea tu chatbot inteligente
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="logs">Logs y Monitoreo</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <ChatbotConfig />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <BotLogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}

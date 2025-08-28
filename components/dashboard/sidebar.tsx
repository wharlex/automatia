"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/useAuth"
import { useAccessControl } from "@/hooks/useAccessControl"
import { 
  Bot, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  FileText, 
  Users,
  Shield,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const { isAdmin, isLoading } = useAccessControl()

  const navigation = [
    {
      title: "Chatbot",
      href: "/dashboard/chatbot",
      icon: Bot,
      description: "Configuración y monitoreo del chatbot",
    },
    {
      title: "Flujos",
      href: "/dashboard/flows",
      icon: MessageSquare,
      description: "Flujos de conversación automatizados",
    },
    {
      title: "Base de Conocimiento",
      href: "/dashboard/knowledge",
      icon: FileText,
      description: "Documentos e información del negocio",
    },
    {
      title: "Conversaciones",
      href: "/dashboard/conversations",
      icon: Users,
      description: "Historial de conversaciones",
    },
    {
      title: "Analíticas",
      href: "/dashboard/analytics",
      icon: BarChart3,
      description: "Métricas y reportes",
    },
    {
      title: "Configuración",
      href: "/dashboard/settings",
      icon: Settings,
      description: "Ajustes generales",
    },
  ]

  // Admin-only navigation
  const adminNavigation = [
    {
      title: "Control de Acceso",
      href: "/dashboard/admin/access-control",
      icon: Shield,
      description: "Gestionar permisos de usuarios",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-blue-600">
              Administración
            </h2>
            <div className="space-y-1">
              {adminNavigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="px-3 py-2">
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                {user?.email || "Usuario"}
              </span>
            </div>
            {isAdmin && (
              <div className="mt-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Administrador
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

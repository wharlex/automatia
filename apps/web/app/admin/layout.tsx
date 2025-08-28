"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Users, 
  Shield, 
  Settings, 
  Eye, 
  BarChart3,
  LogOut,
  User
} from "lucide-react"

const adminNavigation = [
  {
    name: "Overview",
    href: "/app/admin",
    icon: BarChart3,
    description: "Panel principal y estadísticas"
  },
  {
    name: "Clientes",
    href: "/app/admin/clientes",
    icon: Users,
    description: "Gestionar miembros y aprobaciones"
  },
  {
    name: "Revisión",
    href: "/app/admin/revision",
    icon: Eye,
    description: "Revisar y publicar cambios"
  },
  {
    name: "Acceso",
    href: "/app/admin/access",
    icon: Shield,
    description: "Allowlist y permisos por bot"
  },
  {
    name: "Impersonar",
    href: "/app/admin/impersonate",
    icon: User,
    description: "Entrar como cliente"
  },
  {
    name: "Configuración",
    href: "/app/admin/settings",
    icon: Settings,
    description: "Configuración del sistema"
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  // Check authentication and role
  if (!session?.user || !["OWNER", "ADMIN"].includes(session.user.role as string)) {
    redirect("/app")
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">
                Panel de Administración
              </h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {session.user.role}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                {session.user.email}
              </span>
              <Link
                href="/app"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-800 min-h-screen">
          <div className="px-4 py-6">
            <ul className="space-y-2">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                        )}
                      />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400 group-hover:text-gray-300">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

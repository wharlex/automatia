"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Database, 
  BarChart3, 
  Settings, 
  Users, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Workflow,
  Bell,
  Brain,
  Shield,
  Zap
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAccessControl } from '@/hooks/useAccessControl'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { hasAccess, isAdmin } = useAccessControl()

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      requiresAccess: false
    },
    {
      title: 'Chatbot',
      href: '/dashboard/chatbot',
      icon: MessageSquare,
      requiresAccess: true
    },
    {
      title: 'Flujos',
      href: '/dashboard/flows',
      icon: Workflow,
      requiresAccess: true
    },
    {
      title: 'Base de Conocimiento',
      href: '/dashboard/knowledge',
      icon: Database,
      requiresAccess: true
    },
    {
      title: 'Analíticas',
      href: '/dashboard/analytics',
      icon: BarChart3,
      requiresAccess: true
    },
    {
      title: 'Conversaciones',
      href: '/dashboard/conversations',
      icon: MessageSquare,
      requiresAccess: true
    },
    {
      title: 'Notificaciones',
      href: '/dashboard/notifications',
      icon: Bell,
      requiresAccess: true
    },
    {
      title: 'Configuración Avanzada',
      href: '/dashboard/advanced',
      icon: Brain,
      requiresAccess: true
    }
  ]

  const adminItems = [
    {
      title: 'Control de Acceso',
      href: '/dashboard/admin/access-control',
      icon: Users,
      requiresAccess: false
    }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className={cn(
      "flex flex-col bg-background border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">Automatía</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          if (item.requiresAccess && !hasAccess) return null
          
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          )
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className={cn(
              "pt-6 pb-2",
              isCollapsed ? "px-2" : "px-3"
            )}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Administración
                </h3>
              )}
            </div>
            
            {adminItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t">
        {user && (
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground">Administrador</p>
                  )}
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className={cn(
                "h-8 w-8 p-0",
                isCollapsed ? "mx-auto" : ""
              )}
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

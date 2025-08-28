"use client"

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, LogOut } from 'lucide-react'

export function AuthTest() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-automatia-gold mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Estado de Autenticación</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Badge variant="destructive" className="mb-4">No Autenticado</Badge>
          <p className="text-muted-foreground">
            Debes iniciar sesión para acceder al dashboard
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Usuario Autenticado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge variant="default" className="w-full justify-center">
          ✅ Autenticado
        </Badge>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-automatia-gold" />
            <div>
              <p className="font-medium">{user?.displayName || 'Sin nombre'}</p>
              <p className="text-sm text-muted-foreground">Nombre de usuario</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-automatia-gold" />
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Email</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-automatia-gold" />
            <div>
              <p className="font-medium">
                {user?.metadata?.creationTime 
                  ? new Date(user.metadata.creationTime).toLocaleDateString('es-AR')
                  : 'N/A'
                }
              </p>
              <p className="text-sm text-muted-foreground">Fecha de registro</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={signOut} 
          variant="outline" 
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </CardContent>
    </Card>
  )
}



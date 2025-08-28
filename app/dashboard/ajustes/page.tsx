"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User, Mail, Bell, Shield, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AjustesPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const [settings, setSettings] = useState({
    nombre: user?.displayName || "",
    email: user?.email || "",
    notificaciones: true,
    notificacionesEmail: true,
    notificacionesPush: false,
    privacidad: "publico",
    idioma: "es",
    zonaHoraria: "America/Argentina/Buenos_Aires"
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] to-[#1a365d] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-automatia-gold mx-auto mb-4"></div>
          <p className="text-automatia-white">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('Configuración guardada exitosamente!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] to-[#1a365d] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="text-automatia-white hover:text-automatia-gold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-automatia-gold to-automatia-gold-bright rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-automatia-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-automatia-white">Configuración</h1>
                <p className="text-automatia-gold">Ajustes de tu cuenta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardHeader>
              <CardTitle className="text-automatia-gold flex items-center">
                <User className="w-5 h-5 mr-2" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nombre" className="text-automatia-white">Nombre</Label>
                <Input
                  id="nombre"
                  value={settings.nombre}
                  onChange={(e) => setSettings({...settings, nombre: e.target.value})}
                  className="bg-automatia-black/30 border-automatia-gold/20 text-automatia-white"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-automatia-white">Email</Label>
                <Input
                  id="email"
                  value={settings.email}
                  disabled
                  className="bg-automatia-black/30 border-automatia-gold/20 text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardHeader>
              <CardTitle className="text-automatia-gold flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notificaciones" className="text-automatia-white">
                  Notificaciones generales
                </Label>
                <Switch
                  id="notificaciones"
                  checked={settings.notificaciones}
                  onCheckedChange={(checked) => setSettings({...settings, notificaciones: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notificacionesEmail" className="text-automatia-white">
                  Notificaciones por email
                </Label>
                <Switch
                  id="notificacionesEmail"
                  checked={settings.notificacionesEmail}
                  onCheckedChange={(checked) => setSettings({...settings, notificacionesEmail: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notificacionesPush" className="text-automatia-white">
                  Notificaciones push
                </Label>
                <Switch
                  id="notificacionesPush"
                  checked={settings.notificacionesPush}
                  onCheckedChange={(checked) => setSettings({...settings, notificacionesPush: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardHeader>
              <CardTitle className="text-automatia-gold flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="privacidad" className="text-automatia-white">Visibilidad del perfil</Label>
                <select
                  id="privacidad"
                  value={settings.privacidad}
                  onChange={(e) => setSettings({...settings, privacidad: e.target.value})}
                  className="w-full bg-automatia-black/30 border border-automatia-gold/20 text-automatia-white rounded-md px-3 py-2"
                >
                  <option value="publico">Público</option>
                  <option value="privado">Privado</option>
                  <option value="solo-contactos">Solo contactos</option>
                </select>
              </div>

              <div>
                <Label htmlFor="idioma" className="text-automatia-white">Idioma</Label>
                <select
                  id="idioma"
                  value={settings.idioma}
                  onChange={(e) => setSettings({...settings, idioma: e.target.value})}
                  className="w-full bg-automatia-black/30 border border-automatia-gold/20 text-automatia-white rounded-md px-3 py-2"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              <div>
                <Label htmlFor="zonaHoraria" className="text-automatia-white">Zona horaria</Label>
                <select
                  id="zonaHoraria"
                  value={settings.zonaHoraria}
                  onChange={(e) => setSettings({...settings, zonaHoraria: e.target.value})}
                  className="w-full bg-automatia-black/30 border border-automatia-gold/20 text-automatia-white rounded-md px-3 py-2"
                >
                  <option value="America/Argentina/Buenos_Aires">Argentina (GMT-3)</option>
                  <option value="America/Mexico_City">México (GMT-6)</option>
                  <option value="America/New_York">Nueva York (GMT-5)</option>
                  <option value="Europe/Madrid">España (GMT+1)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="bg-automatia-black/50 border-automatia-gold/20">
            <CardHeader>
              <CardTitle className="text-automatia-gold flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Información de la Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <p className="text-sm text-gray-400">ID de Usuario</p>
                <p className="text-automatia-white font-mono text-sm">{user?.uid}</p>
              </div>
              
              <div className="bg-automatia-black/30 rounded-lg p-4">
                <p className="text-sm text-gray-400">Fecha de registro</p>
                <p className="text-automatia-white">
                  {user?.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString('es-AR')
                    : 'N/A'
                  }
                </p>
              </div>

              <div className="bg-automatia-black/30 rounded-lg p-4">
                <p className="text-sm text-gray-400">Último acceso</p>
                <p className="text-automatia-white">
                  {user?.metadata?.lastSignInTime 
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('es-AR')
                    : 'N/A'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-automatia-gold text-automatia-black hover:bg-automatia-gold-bright px-8 py-3"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  )
}

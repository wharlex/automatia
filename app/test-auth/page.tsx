"use client"

import { AuthTest } from '@/components/AuthTest'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function TestAuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1C2F] to-[#1a365d] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-automatia-white mb-4">
            🧪 Prueba de Autenticación
          </h1>
          <p className="text-xl text-automatia-gold">
            Verifica que Firebase y Google Auth estén funcionando correctamente
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <Link href="/login">
            <Button variant="outline" className="border-automatia-gold text-automatia-gold">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ir al Login
            </Button>
          </Link>
          <Link href="/registro">
            <Button variant="outline" className="border-automatia-gold text-automatia-gold">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ir al Registro
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-automatia-gold text-automatia-gold">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ir al Dashboard
            </Button>
          </Link>
        </div>

        {/* Test Component */}
        <div className="mb-8">
          <AuthTest />
        </div>

        {/* Instructions */}
        <Card className="bg-automatia-black/50 border-automatia-gold/20">
          <CardHeader>
            <CardTitle className="text-automatia-gold">📋 Instrucciones de Prueba</CardTitle>
            <CardDescription className="text-automatia-white">
              Sigue estos pasos para verificar que todo esté funcionando
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-automatia-gold">1. Login con Google</h4>
                <ol className="list-decimal list-inside text-sm text-automatia-white space-y-1">
                  <li>Ve a la página de <Link href="/login" className="text-automatia-gold underline">login</Link></li>
                  <li>Haz clic en "Continuar con Google"</li>
                  <li>Selecciona tu cuenta de Google</li>
                  <li>Verifica que te redirija al dashboard</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-automatia-gold">2. Registro con Google</h4>
                <ol className="list-decimal list-inside text-sm text-automatia-white space-y-1">
                  <li>Ve a la página de <Link href="/registro" className="text-automatia-gold underline">registro</Link></li>
                  <li>Haz clic en "Registrarse con Google"</li>
                  <li>Selecciona tu cuenta de Google</li>
                  <li>Verifica que te redirija al dashboard</li>
                </ol>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-automatia-gold">3. Verificación</h4>
              <ul className="list-disc list-inside text-sm text-automatia-white space-y-1">
                <li>Regresa a esta página después del login/registro</li>
                <li>Deberías ver "Usuario Autenticado" con tus datos</li>
                <li>Prueba el botón "Cerrar Sesión"</li>
                <li>Verifica que te redirija al login</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="bg-automatia-black/50 border-automatia-gold/20 mt-8">
          <CardHeader>
            <CardTitle className="text-red-400">🚨 Solución de Problemas</CardTitle>
            <CardDescription className="text-automatia-white">
              Si algo no funciona, revisa estos puntos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-automatia-white">
              <p><strong>Error de API Key:</strong> Verifica que el archivo .env.local esté configurado</p>
              <p><strong>Google Auth no funciona:</strong> Asegúrate de que esté habilitado en Firebase Console</p>
              <p><strong>Redirección no funciona:</strong> Verifica que las rutas estén correctas</p>
              <p><strong>Errores en consola:</strong> Revisa la consola del navegador para más detalles</p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="ghost" className="text-automatia-gold hover:text-automatia-gold-bright">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}



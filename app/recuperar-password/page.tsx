"use client"

import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowLeft,
  MessageSquare,
  Phone,
  Shield
} from "lucide-react"
import Link from "next/link"

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError("Por favor ingresa tu email")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (error: any) {
      console.error("Password reset error:", error)
      if (error.code === "auth/user-not-found") {
        setError("No existe una cuenta con este email")
      } else if (error.code === "auth/invalid-email") {
        setError("Email inválido")
      } else if (error.code === "auth/too-many-requests") {
        setError("Demasiados intentos. Intenta más tarde")
      } else {
        setError("Error al enviar el email de recuperación. Intenta nuevamente")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1C2F] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#C5B358] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-[#0f0f0f]">A</span>
          </div>
          <h1 className="text-3xl font-bold text-[#EAEAEA] mb-2">
            Recuperar contraseña
          </h1>
          <p className="text-[#EAEAEA]/70">
            Te ayudamos a recuperar el acceso a tu cuenta
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#C5B358]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-[#C5B358]" />
            </div>
            <CardTitle className="text-2xl text-[#EAEAEA]">
              {success ? "Email enviado" : "Recuperar contraseña"}
            </CardTitle>
            <CardDescription className="text-[#EAEAEA]/70">
              {success 
                ? "Revisa tu bandeja de entrada para continuar"
                : "Ingresa tu email y te enviaremos instrucciones"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!success ? (
              <>
                {/* Instructions */}
                <div className="bg-[#0A1C2F] rounded-lg p-4 border border-[#C5B358]/20">
                  <h3 className="font-semibold text-[#EAEAEA] mb-2">¿Cómo funciona?</h3>
                  <ol className="text-sm text-[#EAEAEA]/80 space-y-1">
                    <li>1. Ingresa tu email registrado</li>
                    <li>2. Recibirás un enlace de recuperación</li>
                    <li>3. Haz clic en el enlace del email</li>
                    <li>4. Crea una nueva contraseña</li>
                  </ol>
                </div>

                {/* Error Messages */}
                {error && (
                  <Alert className="border-red-500/20 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-500">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Reset Form */}
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#EAEAEA]">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-[#EAEAEA]/50" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-[#0A1C2F] border-[#C5B358]/30 text-[#EAEAEA] focus:border-[#C5B358]"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#C5B358] hover:bg-[#FFD700] text-[#0f0f0f] font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar email de recuperación"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* Success Message */}
                <Alert className="border-green-500/20 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-500">
                    ¡Email enviado exitosamente! Revisa tu bandeja de entrada en <strong>{email}</strong>
                  </AlertDescription>
                </Alert>

                {/* Next Steps */}
                <div className="bg-[#0A1C2F] rounded-lg p-4 border border-[#C5B358]/20">
                  <h3 className="font-semibold text-[#EAEAEA] mb-2">Próximos pasos:</h3>
                  <ol className="text-sm text-[#EAEAEA]/80 space-y-1">
                    <li>1. Revisa tu email en <strong>{email}</strong></li>
                    <li>2. Busca el email de "Automatía"</li>
                    <li>3. Haz clic en "Restablecer contraseña"</li>
                    <li>4. Crea una nueva contraseña segura</li>
                  </ol>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setSuccess(false)}
                    variant="outline"
                    className="w-full border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0f0f0f] font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    Enviar a otro email
                  </Button>

                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0f0f0f] font-semibold py-3 rounded-xl transition-all duration-300"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver al login
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Help Section */}
            <div className="text-center">
              <p className="text-sm text-[#EAEAEA]/50 mb-3">
                ¿Necesitas ayuda adicional?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0f0f0f]"
                  onClick={() => window.open('https://wa.me/543416115981', '_blank')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0f0f0f]"
                  onClick={() => window.open('tel:+543416115981', '_blank')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Llamar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4">
            Consejos de seguridad:
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-[#EAEAEA]/70">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-[#C5B358]" />
              <span>Usa contraseñas únicas y seguras</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-[#C5B358]" />
              <span>No compartas tu contraseña con nadie</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-[#C5B358]" />
              <span>Habilita la autenticación de dos factores</span>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link 
            href="/login"
            className="text-[#C5B358] hover:text-[#FFD700] transition-colors font-semibold"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

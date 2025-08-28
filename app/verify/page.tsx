"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth"
import { auth } from "@/lib/firebaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  ArrowRight,
  MessageSquare,
  Phone,
  LogOut
} from "lucide-react"
import { signOut } from "firebase/auth"

export default function VerifyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState("")
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        if (currentUser.emailVerified) {
          router.replace("/dashboard")
        }
      } else {
        router.replace("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResendVerification = async () => {
    if (!user) return

    setIsResending(true)
    setResendError("")
    setResendSuccess(false)

    try {
      await sendEmailVerification(user)
      setResendSuccess(true)
      setCountdown(60) // 60 segundos de espera
    } catch (error: any) {
      console.error("Resend error:", error)
      setResendError("Error al reenviar el email. Intenta nuevamente.")
    } finally {
      setIsResending(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.replace("/login")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A1C2F] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#C5B358] mx-auto mb-4" />
          <p className="text-[#EAEAEA]">Cargando...</p>
        </div>
      </div>
    )
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
            Verifica tu email
          </h1>
          <p className="text-[#EAEAEA]/70">
            Un paso más para acceder a Automatía
          </p>
        </div>

        {/* Verification Card */}
        <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#C5B358]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-[#C5B358]" />
            </div>
            <CardTitle className="text-2xl text-[#EAEAEA]">
              Email enviado a {user.email}
            </CardTitle>
            <CardDescription className="text-[#EAEAEA]/70">
              Revisa tu bandeja de entrada y haz clic en el enlace de verificación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Instructions */}
            <div className="bg-[#0A1C2F] rounded-lg p-4 border border-[#C5B358]/20">
              <h3 className="font-semibold text-[#EAEAEA] mb-2">Pasos a seguir:</h3>
              <ol className="text-sm text-[#EAEAEA]/80 space-y-1">
                <li>1. Revisa tu email en <strong>{user.email}</strong></li>
                <li>2. Busca el email de "Automatía"</li>
                <li>3. Haz clic en "Verificar email"</li>
                <li>4. Regresa aquí y haz clic en "Ya verifiqué"</li>
              </ol>
            </div>

            {/* Success/Error Messages */}
            {resendSuccess && (
              <Alert className="border-green-500/20 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  ¡Email reenviado exitosamente! Revisa tu bandeja de entrada.
                </AlertDescription>
              </Alert>
            )}

            {resendError && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-500">
                  {resendError}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRefresh}
                className="w-full bg-[#C5B358] hover:bg-[#FFD700] text-[#0f0f0f] font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Ya verifiqué mi email
              </Button>

              <Button
                onClick={handleResendVerification}
                variant="outline"
                className="w-full border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0f0f0f] font-semibold py-3 rounded-xl transition-all duration-300"
                disabled={isResending || countdown > 0}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Reenviando...
                  </>
                ) : countdown > 0 ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Reenviar en {countdown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Reenviar email
                  </>
                )}
              </Button>

              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Cerrar sesión
              </Button>
            </div>

            {/* Help Section */}
            <div className="text-center">
              <p className="text-sm text-[#EAEAEA]/50 mb-3">
                ¿No recibiste el email o tienes problemas?
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
            Consejos útiles:
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-[#EAEAEA]/70">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#C5B358]" />
              <span>Revisa también la carpeta de spam</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#C5B358]" />
              <span>El email puede tardar unos minutos</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#C5B358]" />
              <span>Verifica que el email esté correcto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

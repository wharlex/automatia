"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Mail, 
  Lock, 
  User,
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  MessageSquare,
  Phone,
  ArrowRight,
  Shield,
  CheckSquare
} from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          router.replace("/dashboard")
        } else {
          router.replace("/verify")
        }
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("El nombre es requerido")
      return false
    }
    if (!formData.email.trim()) {
      setError("El email es requerido")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Ingresa un email válido")
      return false
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return false
    }
    if (!formData.acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return false
    }
    return true
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      
      // Enviar email de verificación
      await sendEmailVerification(userCredential.user)
      
      setSuccess("¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.")
      
      // Redirección manejada por useEffect
    } catch (error: any) {
      console.error("Registration error:", error)
      if (error.code === "auth/email-already-in-use") {
        setError("Ya existe una cuenta con este email")
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña es muy débil")
      } else if (error.code === "auth/invalid-email") {
        setError("Email inválido")
      } else {
        setError("Error al crear la cuenta. Intenta nuevamente")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true)
    setError("")
    setSuccess("")

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      setSuccess("¡Cuenta creada con Google exitosamente!")
      // Redirección manejada por useEffect
    } catch (error: any) {
      console.error("Google registration error:", error)
      if (error.code === "auth/popup-closed-by-user") {
        setError("El popup de Google fue cerrado. Intenta nuevamente")
      } else if (error.code === "auth/popup-blocked") {
        setError("El popup fue bloqueado. Permite popups para este sitio")
      } else {
        setError("Error al crear cuenta con Google. Intenta nuevamente")
      }
    } finally {
      setIsGoogleLoading(false)
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
            Únete a Automatía
          </h1>
          <p className="text-[#EAEAEA]/70">
            Crea tu cuenta y comienza a automatizar tu negocio
          </p>
        </div>

        {/* Register Card */}
        <Card className="bg-[#0f0f0f] border-[#C5B358]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#EAEAEA]">
              Crear Cuenta
            </CardTitle>
            <CardDescription className="text-[#EAEAEA]/70">
              Comienza tu viaje hacia la automatización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign-Up */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#C5B358]/30 text-[#C5B358] hover:bg-[#C5B358] hover:text-[#0f0f0f] font-semibold py-3 rounded-xl transition-all duration-300"
              onClick={handleGoogleRegister}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isGoogleLoading ? "Creando cuenta..." : "Crear cuenta con Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#C5B358]/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f0f0f] px-2 text-[#EAEAEA]/50">
                  O regístrate con email
                </span>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-500">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500/20 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Registration Form */}
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#EAEAEA]">
                  Nombre completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-[#EAEAEA]/50" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 bg-[#0A1C2F] border-[#C5B358]/30 text-[#EAEAEA] focus:border-[#C5B358]"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#EAEAEA]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#EAEAEA]/50" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-[#0A1C2F] border-[#C5B358]/30 text-[#EAEAEA] focus:border-[#C5B358]"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#EAEAEA]">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#EAEAEA]/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 bg-[#0A1C2F] border-[#C5B358]/30 text-[#EAEAEA] focus:border-[#C5B358]"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#EAEAEA]/50 hover:text-[#EAEAEA]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#EAEAEA]">
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#EAEAEA]/50" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 bg-[#0A1C2F] border-[#C5B358]/30 text-[#EAEAEA] focus:border-[#C5B358]"
                    placeholder="Repite tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-[#EAEAEA]/50 hover:text-[#EAEAEA]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#C5B358] bg-[#0A1C2F] border-[#C5B358]/30 rounded focus:ring-[#C5B358]"
                />
                <Label htmlFor="acceptTerms" className="text-sm text-[#EAEAEA]/80 leading-relaxed">
                  Acepto los{" "}
                  <Link href="/terminos" className="text-[#C5B358] hover:text-[#FFD700] underline">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacidad" className="text-[#C5B358] hover:text-[#FFD700] underline">
                    política de privacidad
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#C5B358] hover:bg-[#FFD700] text-[#0f0f0f] font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear Cuenta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-[#EAEAEA]/50">
                ¿Ya tienes cuenta?{" "}
                <Link 
                  href="/login"
                  className="text-[#C5B358] hover:text-[#FFD700] transition-colors font-semibold"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-[#EAEAEA] mb-4">
            ¿Por qué elegir Automatía?
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-[#EAEAEA]/70">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-[#C5B358]" />
              <span>Implementación en 48 horas</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#C5B358]" />
              <span>ROI garantizado desde el primer mes</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#C5B358]" />
              <span>Soporte 24/7 en español</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#EAEAEA]/50 mb-3">
            ¿Tienes preguntas sobre el registro?
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
      </div>
    </div>
  )
}

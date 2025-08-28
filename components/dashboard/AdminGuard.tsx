"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertCircle, Loader2 } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [user, loading] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setChecking(false)
        return
      }

      try {
        const token = await user.getIdToken(true) // Force refresh to get latest claims
        const decodedToken = await user.getIdTokenResult()

        setIsAdmin(decodedToken.claims.role === "admin")
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setChecking(false)
      }
    }

    if (!loading) {
      checkAdminStatus()
    }
  }, [user, loading])

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md bg-[#0A1C2F] border-[#C5B358]/20">
          <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#C5B358] mx-auto mb-4" />
            <p className="text-[#EAEAEA]">Verificando permisos...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md bg-[#0A1C2F] border-[#C5B358]/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <CardTitle className="text-[#EAEAEA]">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-4">Necesitas iniciar sesión para acceder al panel de administración.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md bg-[#0A1C2F] border-[#C5B358]/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <CardTitle className="text-[#EAEAEA]">Acceso Restringido</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-4">No tienes permisos de administrador para acceder a esta sección.</p>
            <p className="text-sm text-gray-500">Contacta al administrador del sistema si necesitas acceso.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

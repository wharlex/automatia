"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface AuthRedirectProps {
  redirectTo?: string
  requireAuth?: boolean
  children: React.ReactNode
}

export function AuthRedirect({ 
  redirectTo = '/dashboard', 
  requireAuth = true, 
  children 
}: AuthRedirectProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // User is not authenticated, redirect to login
        router.push('/login')
      } else if (!requireAuth && isAuthenticated) {
        // User is authenticated but shouldn't be on this page, redirect to dashboard
        router.push(redirectTo)
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-automatia-gold mx-auto mb-4"></div>
          <p className="text-automatia-white">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // If authentication requirements are met, render children
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>
  }

  // Don't render anything while redirecting
  return null
}



import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

interface AccessControl {
  hasAccess: boolean
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  checkAccess: () => Promise<void>
}

export function useAccessControl(): AccessControl {
  const { user, isAuthenticated } = useAuth()
  const [hasAccess, setHasAccess] = useState(false)
  const [isAdmin, setAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAccess = async () => {
    if (!user?.email) {
      setHasAccess(false)
      setAdmin(false)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/auth/check-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await response.json()

      if (response.ok) {
        setHasAccess(data.hasAccess)
        setAdmin(data.isAdmin)
      } else {
        setError(data.error || 'Error checking access')
        setHasAccess(false)
        setAdmin(false)
      }
    } catch (err) {
      setError('Network error checking access')
      setHasAccess(false)
      setAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      checkAccess()
    } else {
      setHasAccess(false)
      setAdmin(false)
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.email])

  return {
    hasAccess,
    isAdmin,
    isLoading,
    error,
    checkAccess,
  }
}





import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendEmailVerification
} from 'firebase/auth'
import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebaseClient'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signInWithGoogle: (rememberMe?: boolean) => Promise<void>
  signUp: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsAuthenticated(!!user)
      setIsLoading(false)
      
      // Check for remembered session
      if (!user) {
        const rememberedUser = localStorage.getItem('automatia_remembered_user')
        if (rememberedUser) {
          try {
            const parsedUser = JSON.parse(rememberedUser)
            setUser(parsedUser)
            setIsAuthenticated(true)
          } catch (error) {
            console.error('Error parsing remembered user:', error)
            localStorage.removeItem('automatia_remembered_user')
          }
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Store remember me preference
      localStorage.setItem('automatia_remember_me', rememberMe.toString())
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      setIsAuthenticated(true)
      
      if (rememberMe) {
        localStorage.setItem('automatia_remembered_user', JSON.stringify(userCredential.user))
      }
    } catch (err: any) {
      setError(err.message || 'Error signing in')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async (rememberMe: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Store remember me preference
      localStorage.setItem('automatia_remember_me', rememberMe.toString())
      
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      setUser(userCredential.user)
      setIsAuthenticated(true)
      
      if (rememberMe) {
        localStorage.setItem('automatia_remembered_user', JSON.stringify(userCredential.user))
      }
      
      // Return success for better control
      return userCredential.user
    } catch (err: any) {
      setError(err.message || 'Error signing in with Google')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Store remember me preference
      localStorage.setItem('automatia_remember_me', rememberMe.toString())
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      setIsAuthenticated(true)
      
      // Send email verification
      await sendEmailVerification(userCredential.user)
      
      if (rememberMe) {
        localStorage.setItem('automatia_remembered_user', JSON.stringify(userCredential.user))
      }
      
      // Return success for better control
      return userCredential.user
    } catch (err: any) {
      setError(err.message || 'Error signing up')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setIsAuthenticated(false)
      
      // Clear remembered session
      localStorage.removeItem('automatia_remembered_user')
      localStorage.removeItem('automatia_remember_me')
    } catch (err: any) {
      setError(err.message || 'Error signing out')
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    clearError,
  }
}



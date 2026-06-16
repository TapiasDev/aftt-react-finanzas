import { useEffect, useState, type PropsWithChildren } from 'react'
import { authService } from '../../services/auth-service'
import type { AuthSession } from '../../shared/types/auth'
import { AuthContext, type AuthContextValue } from './AuthContext'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      try {
        setIsLoading(true)
        setError(null)

        const storedSession = await authService.getCurrentSession()

        if (isMounted) {
          setSession(storedSession)
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(getErrorMessage(caughtError))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadSession()

    return () => {
      isMounted = false
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      setIsSubmitting(true)
      setError(null)

      const nextSession = await authService.signIn({ email, password })
      setSession(nextSession)
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function changeInitialPassword(newPassword: string, confirmPassword: string) {
    try {
      setIsSubmitting(true)
      setError(null)

      const nextSession = await authService.changeInitialPassword({
        newPassword,
        confirmPassword,
      })

      setSession(nextSession)
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function signOut() {
    try {
      setIsSubmitting(true)
      setError(null)

      await authService.signOut()
      setSession(null)
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      setIsSubmitting(false)
    }
  }

  const value = {
    session,
    currentUser: session?.user ?? null,
    isLoading,
    isSubmitting,
    error,
    signIn,
    changeInitialPassword,
    signOut,
  } satisfies AuthContextValue

  return <AuthContext value={value}>{children}</AuthContext>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected auth error.'
}

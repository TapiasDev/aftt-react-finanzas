import { useEffect, useState, type PropsWithChildren } from 'react'
import { authService } from '../../services/auth-service'
import {
  clearStoredAccessToken,
  clearStoredAuthSession,
  writeStoredAccessToken,
  writeStoredAuthSession,
} from '../../services/auth-service/auth-session.storage'
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

          if (storedSession) {
            writeStoredAuthSession(storedSession)
          } else {
            clearStoredAccessToken()
            clearStoredAuthSession()
          }
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(getErrorMessage(caughtError))
          clearStoredAccessToken()
          clearStoredAuthSession()
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

  async function signIn(username: string, password: string) {
    try {
      setIsSubmitting(true)
      setError(null)

      const loginResponse = await authService.signIn({ username, password })
      const nextSession: AuthSession = { user: loginResponse.user }

      writeStoredAccessToken(loginResponse.accessToken)
      writeStoredAuthSession(nextSession)
      setSession(nextSession)
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function changeInitialPassword(newPassword: string, confirmPassword: string, username?: string) {
    try {
      setIsSubmitting(true)
      setError(null)

      const nextSession = await authService.changeInitialPassword({
        newPassword,
        confirmPassword,
        username,
      })

      writeStoredAuthSession(nextSession)
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
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      throw new Error(message, { cause: caughtError })
    } finally {
      clearStoredAccessToken()
      clearStoredAuthSession()
      setSession(null)
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

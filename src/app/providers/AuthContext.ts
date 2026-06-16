import { createContext } from 'react'
import type { AuthSession, AuthUser } from '../../shared/types/auth'

export interface AuthContextValue {
  session: AuthSession | null
  currentUser: AuthUser | null
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  signIn: (username: string, password: string) => Promise<void>
  changeInitialPassword: (newPassword: string, confirmPassword: string, username?: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

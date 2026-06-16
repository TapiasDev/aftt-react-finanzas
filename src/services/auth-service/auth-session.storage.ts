import type { AuthSession } from '../../shared/types/auth'

const SESSION_STORAGE_KEY = 'expense-planner-auth-session'
const ACCESS_TOKEN_STORAGE_KEY = 'expense-planner-access-token'

export function readStoredAuthSession(): AuthSession | null {
  const rawValue = window.localStorage.getItem(SESSION_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as AuthSession
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

export function writeStoredAuthSession(session: AuthSession) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function readStoredAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function writeStoredAccessToken(token: string) {
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
}

export function clearStoredAccessToken() {
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function clearStoredAuthSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}

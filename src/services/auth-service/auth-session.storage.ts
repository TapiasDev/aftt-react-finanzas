import type { AuthSession } from '../../shared/types/auth'

const SESSION_STORAGE_KEY = 'expense-planner-auth-session'

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

export function clearStoredAuthSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}

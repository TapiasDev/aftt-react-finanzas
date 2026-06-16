import { validateInitialPasswordChange, validateSignInInput } from '../../shared/lib/validation'
import type {
  AuthSession,
  AuthUser,
  ChangeInitialPasswordInput,
  SignInInput,
  UserStatus,
} from '../../shared/types/auth'
import type { AuthService } from './auth-service'
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
} from './auth-session.storage'

interface MockUserRecord {
  id: string
  email: string
  status: UserStatus
  password: string
}

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const users: MockUserRecord[] = [
  {
    id: 'user-001',
    email: 'new.user@example.com',
    status: 'New',
    password: 'Temp12345',
  },
  {
    id: 'user-002',
    email: 'active.user@example.com',
    status: 'Active',
    password: 'Active12345',
  },
]

function toSession(user: MockUserRecord): AuthSession {
  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    status: user.status,
  }

  return { user: authUser }
}

function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase())
}

function findUserById(userId: string) {
  return users.find((user) => user.id === userId)
}

export const authServiceMock: AuthService = {
  async getCurrentSession() {
    await delay(80)
    return readStoredAuthSession()
  },

  async signIn(input: SignInInput) {
    await delay(180)

    const validation = validateSignInInput(input.email, input.password)

    if (!validation.isValid) {
      throw new Error(validation.errors[0])
    }

    const user = findUserByEmail(input.email)

    if (!user || user.password !== input.password) {
      throw new Error('Invalid email or password.')
    }

    const session = toSession(user)
    writeStoredAuthSession(session)

    return session
  },

  async changeInitialPassword(input: ChangeInitialPasswordInput) {
    await delay(180)

    const validation = validateInitialPasswordChange(input.newPassword, input.confirmPassword)

    if (!validation.isValid) {
      throw new Error(validation.errors[0])
    }

    const currentSession = readStoredAuthSession()

    if (!currentSession) {
      throw new Error('No active session was found.')
    }

    const user = findUserById(currentSession.user.id)

    if (!user) {
      throw new Error('Authenticated user was not found.')
    }

    if (user.status !== 'New') {
      throw new Error('Initial password change is only available for new users.')
    }

    user.password = input.newPassword
    user.status = 'Active'

    const nextSession = toSession(user)
    writeStoredAuthSession(nextSession)

    return nextSession
  },

  async signOut() {
    await delay(50)
    clearStoredAuthSession()
  },
}

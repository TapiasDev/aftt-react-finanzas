import { apiRequest, apiRequestOrNull } from '../../shared/lib/http'
import type { AuthSession, ChangeInitialPasswordInput, SignInInput } from '../../shared/types/auth'
import type { AuthService } from './auth-service'

export const authServiceApi: AuthService = {
  async getCurrentSession() {
    return apiRequestOrNull<AuthSession>('/auth/me')
  },

  async signIn(input: SignInInput) {
    return apiRequest<AuthSession>('/auth/login', {
      method: 'POST',
      body: input,
    })
  },

  async changeInitialPassword(input: ChangeInitialPasswordInput) {
    return apiRequest<AuthSession>('/auth/change-initial-password', {
      method: 'POST',
      body: input,
    })
  },

  async signOut() {
    await apiRequest<void>('/auth/logout', {
      method: 'POST',
    })
  },
}

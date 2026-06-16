import type { AuthService } from './auth-service'
import { authServiceApi } from './auth-service.api'
import { authServiceMock } from './auth-service.mock'

type AuthServiceMode = 'mock' | 'api'

function getAuthServiceMode(): AuthServiceMode {
  const configuredMode = import.meta.env.VITE_AUTH_SERVICE_MODE

  return configuredMode === 'mock' ? 'mock' : 'api'
}

export const authService: AuthService =
  getAuthServiceMode() === 'api' ? authServiceApi : authServiceMock

export const authServiceMode = getAuthServiceMode()

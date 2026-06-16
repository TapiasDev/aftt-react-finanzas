export type UserStatus = 'New' | 'Active'

export interface AuthUser {
  id: string
  username: string
  status: UserStatus
}

export interface AuthSession {
  user: AuthUser
}

export interface AuthLoginResponse extends AuthSession {
  accessToken: string
}

export interface SignInInput {
  username: string
  password: string
}

export interface ChangeInitialPasswordInput {
  newPassword: string
  confirmPassword: string
  username?: string
}

export interface AuthValidationResult {
  isValid: boolean
  errors: string[]
}

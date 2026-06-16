export type UserStatus = 'New' | 'Active'

export interface AuthUser {
  id: string
  email: string
  status: UserStatus
}

export interface AuthSession {
  user: AuthUser
}

export interface SignInInput {
  email: string
  password: string
}

export interface ChangeInitialPasswordInput {
  newPassword: string
  confirmPassword: string
}

export interface AuthValidationResult {
  isValid: boolean
  errors: string[]
}

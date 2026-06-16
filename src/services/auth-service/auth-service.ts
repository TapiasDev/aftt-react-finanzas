import type {
  AuthLoginResponse,
  AuthSession,
  ChangeInitialPasswordInput,
  SignInInput,
} from '../../shared/types/auth'

export interface AuthService {
  getCurrentSession(): Promise<AuthSession | null>
  signIn(input: SignInInput): Promise<AuthLoginResponse>
  changeInitialPassword(input: ChangeInitialPasswordInput): Promise<AuthSession>
  signOut(): Promise<void>
}

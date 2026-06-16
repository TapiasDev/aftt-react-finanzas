import type {
  AuthSession,
  ChangeInitialPasswordInput,
  SignInInput,
} from '../../shared/types/auth'

export interface AuthService {
  getCurrentSession(): Promise<AuthSession | null>
  signIn(input: SignInInput): Promise<AuthSession>
  changeInitialPassword(input: ChangeInitialPasswordInput): Promise<AuthSession>
  signOut(): Promise<void>
}

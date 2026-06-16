import { useAuth } from '../../app/providers/useAuth'

export function SignOutButton() {
  const { signOut, isSubmitting } = useAuth()

  return (
    <button
      type="button"
      className="planner-ghost-button planner-topbar-signout"
      onClick={() => void signOut()}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Saliendo...' : 'Salir'}
    </button>
  )
}

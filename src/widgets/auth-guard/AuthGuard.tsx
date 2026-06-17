import { PlannerProvider } from '../../app/providers/PlannerProvider'
import { useAuth } from '../../app/providers/useAuth'
import { ForcePasswordChangeForm } from '../../features/force-password-change/ForcePasswordChangeForm'
import '../../features/sign-in/AuthScreens.css'
import { SignInForm } from '../../features/sign-in/SignInForm'
import { PlannerPage } from '../../pages/planner/PlannerPage'

export function AuthGuard() {
  const { currentUser, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <div className="auth-header">
            <p className="auth-kicker">Planner quincenal</p>
            <h1>Preparando tu espacio de trabajo.</h1>
            <p>Cargando sesión...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!currentUser) {
    return <SignInForm />
  }

  if (currentUser.status !== 'Active') {
    return <ForcePasswordChangeForm />
  }

  return (
    <PlannerProvider>
      <PlannerPage />
    </PlannerProvider>
  )
}

import { PlannerProvider } from '../../app/providers/PlannerProvider'
import { useAuth } from '../../app/providers/useAuth'
import { ForcePasswordChangeForm } from '../../features/force-password-change/ForcePasswordChangeForm'
import '../../features/sign-in/AuthScreens.css'
import { SignInForm } from '../../features/sign-in/SignInForm'
import { PlannerPage } from '../../pages/planner/PlannerPage'
import { FullScreenLoading } from '../../shared/ui/FullScreenLoading'

export function AuthGuard() {
  const { currentUser, isLoading } = useAuth()

  if (isLoading) {
    return <FullScreenLoading />
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

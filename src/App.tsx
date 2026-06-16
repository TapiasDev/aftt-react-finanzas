import { AuthProvider } from './app/providers/AuthProvider'
import { AuthGuard } from './widgets/auth-guard/AuthGuard'

function App() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  )
}

export default App

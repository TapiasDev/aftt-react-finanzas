import { AuthProvider } from './app/providers/AuthProvider'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { ThemeToggle } from './widgets/theme-toggle/ThemeToggle'
import { AuthGuard } from './widgets/auth-guard/AuthGuard'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeToggle />
        <AuthGuard />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

import { useState, type FormEvent } from 'react'
import { useAuth } from '../../app/providers/useAuth'
import '../sign-in/AuthScreens.css'

export function ForcePasswordChangeForm() {
  const { currentUser, changeInitialPassword, isSubmitting, error } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await changeInitialPassword(newPassword, confirmPassword)
      setMessage('Contrasena actualizada. Ya puedes usar el planner.')
    } catch (caughtError) {
      setMessage(
        caughtError instanceof Error ? caughtError.message : 'Unexpected password change error.',
      )
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-header">
          <p className="auth-kicker">Primer acceso</p>
          <h1>Cambio obligatorio de contrasena</h1>
          <p>
            El usuario <code>{currentUser?.email}</code> todavia esta en estado <code>New</code>.
            Debe registrar su propia contrasena antes de entrar al planner.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Nueva contrasena</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Confirmar contrasena</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>

          <button className="auth-primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Actualizando...' : 'Guardar nueva contrasena'}
          </button>
        </form>

        {message || error ? <p className="auth-message">{message ?? error}</p> : null}
      </section>
    </main>
  )
}

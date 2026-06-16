import { useState, type FormEvent } from 'react'
import { useAuth } from '../../app/providers/useAuth'
import { validateInitialPasswordChange } from '../../shared/lib/validation'
import '../sign-in/AuthScreens.css'

export function ForcePasswordChangeForm() {
  const { currentUser, changeInitialPassword, isSubmitting, error } = useAuth()
  const [username, setUsername] = useState(currentUser?.username ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validation = validateInitialPasswordChange(newPassword, confirmPassword)

    if (!validation.isValid) {
      setMessage(validation.errors[0])
      return
    }

    try {
      await changeInitialPassword(newPassword, confirmPassword, username)
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
            El usuario <code>{currentUser?.username}</code> todavia esta en estado <code>New</code>.
            Debe registrar su propia contrasena antes de entrar al planner. Si lo desea,
            tambien puede cambiar su usuario en este paso.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Usuario opcional</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Nueva contrasena</span>
            <div className="auth-input-with-action">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <button
                className="auth-input-action"
                type="button"
                onClick={() => setShowNewPassword((current) => !current)}
                aria-label={showNewPassword ? 'Ocultar contrasena nueva' : 'Mostrar contrasena nueva'}
              >
                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>

          <label className="auth-field">
            <span>Confirmar contrasena</span>
            <div className="auth-input-with-action">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <button
                className="auth-input-action"
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                aria-label={showConfirmPassword ? 'Ocultar confirmacion de contrasena' : 'Mostrar confirmacion de contrasena'}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
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

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M3 3l18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.6 5.2A11.4 11.4 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.2 4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.7 6.8A18 18 0 0 0 2 12s3.5 6 10 6a10.7 10.7 0 0 0 4.1-.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 9.9A3 3 0 0 0 14.1 14.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

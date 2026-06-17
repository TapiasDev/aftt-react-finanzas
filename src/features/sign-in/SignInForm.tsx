import { useState, type FormEvent } from 'react';
import { useAuth } from '../../app/providers/useAuth';
import './AuthScreens.css';

export function SignInForm() {
  const { signIn, isSubmitting, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await signIn(username, password);
      setMessage(null);
    } catch (caughtError) {
      setMessage(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unexpected sign in error.',
      );
    }
  }

  return (
    <main className='auth-shell'>
      <section className='auth-card'>
        <div className='auth-header'>
          <p className='auth-kicker'>Pladeador y controlador de finanzas</p>
          <h1>Ingresa y controla tus finanzas</h1>
          <em>
            Cuida de los pequeños gastos; un pequeño agujero hunde un barco.
          </em>
        </div>

        <form className='auth-form' onSubmit={handleSubmit}>
          <label className='auth-field'>
            <span>Usuario</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label className='auth-field'>
            <span>Contrasena</span>
            <div className='auth-input-with-action'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className='auth-input-action'
                type='button'
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'
                }
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>

          <button
            className='auth-primary-button'
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        {message || error ? (
          <p className='auth-message'>{message ?? error}</p>
        ) : null}
      </section>
    </main>
  );
}

function EyeIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
      <path
        d='M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <circle
        cx='12'
        cy='12'
        r='3'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
      <path
        d='M3 3l18 18'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
      <path
        d='M10.6 5.2A11.4 11.4 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-3.2 4.2'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6.7 6.8A18 18 0 0 0 2 12s3.5 6 10 6a10.7 10.7 0 0 0 4.1-.8'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.9 9.9A3 3 0 0 0 14.1 14.1'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

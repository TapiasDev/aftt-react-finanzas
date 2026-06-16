import { useState, type FormEvent } from 'react';
import { useAuth } from '../../app/providers/useAuth';
import './AuthScreens.css';

export function SignInForm() {
  const { signIn, isSubmitting, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await signIn(email, password);
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
          <p className='auth-kicker'>Cuida tus finanzas</p>
          <h1>Inicio de sesión</h1>
        </div>

        <form className='auth-form' onSubmit={handleSubmit}>
          <label className='auth-field'>
            <span>Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className='auth-field'>
            <span>Contrasena</span>
            <input
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button
            className='auth-primary-button'
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {message || error ? (
          <p className='auth-message'>{message ?? error}</p>
        ) : null}
      </section>
    </main>
  );
}

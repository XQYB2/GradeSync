import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function AuthForm() {
  const [mode, setMode] = useState('login') // login | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error | confirm-sent
  const [errorMsg, setErrorMsg] = useState('')

  async function handleGoogleLogin() {
    setStatus('loading')
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setStatus('error')
        setErrorMsg(error.message)
        return
      }
      // If email confirmation is required, Supabase returns a user with no session.
      if (data.user && !data.session) {
        setStatus('confirm-sent')
        return
      }
      setStatus('idle')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setStatus('error')
        setErrorMsg(error.message)
        return
      }
      setStatus('idle')
    }
  }

  if (status === 'confirm-sent') {
    return (
      <div className="card auth-card">
        <p className="auth-confirm-msg">
          Check <strong>{email}</strong> for a confirmation link, then log in.
        </p>
        <button
          type="button"
          className="auth-link-btn"
          onClick={() => {
            setStatus('idle')
            setMode('login')
          }}
        >
          Back to log in
        </button>
      </div>
    )
  }

  return (
    <div className="card auth-card">
      <button type="button" className="google-btn" onClick={handleGoogleLogin} disabled={status === 'loading'}>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
          <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" />
        </svg>
        Continue with Google
      </button>

      <div className="auth-divider"><span>or</span></div>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        {errorMsg && <p className="auth-error">{errorMsg}</p>}
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Please wait…' : mode === 'signup' ? 'Sign up' : 'Log in'}
        </button>
      </form>
      <button
        type="button"
        className="auth-link-btn"
        onClick={() => {
          setMode(mode === 'signup' ? 'login' : 'signup')
          setErrorMsg('')
        }}
      >
        {mode === 'signup' ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </div>
  )
}

export default AuthForm

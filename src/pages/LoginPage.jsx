import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { supabase } from '../lib/supabaseClient'
import logo from '../assets/logo.png'

function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/', { replace: true })
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/', { replace: true })
    })
    return () => listener.subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="app login-page">
      <div className="login-header">
        <img src={logo} alt="GradeSync" className="login-logo" />
        <h1>GradeSync</h1>
        <p className="app-subtitle">Sign in to save and sync your grades.</p>
      </div>
      <AuthForm />
      <button type="button" className="auth-link-btn" onClick={() => navigate('/')}>
        Continue without an account
      </button>

      <footer className="app-footer">
        <div className="footer-links">
          <a href="/terms">Terms and Conditions</a>
          <span aria-hidden="true">·</span>
          <a href="/privacy">Privacy Policy</a>
        </div>
        © 2026 GradeSync. Made by{' '}
        <a href="https://github.com/XQYB2/" target="_blank" rel="noopener noreferrer">
          XQYB2
        </a>
      </footer>
    </div>
  )
}

export default LoginPage

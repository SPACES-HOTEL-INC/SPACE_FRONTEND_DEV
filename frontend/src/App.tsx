import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import type { Page, Session } from './types'

/**
 * App = the central state router.
 *
 * State flow overview
 * ────────────────────────────────────────────────────────────────────────
 *  • `page`    → single source of truth for which screen renders
 *               ('login' | 'signup' | 'dashboard').
 *  • `session` → the authenticated hotel context. It is `null` until an auth
 *               screen calls `handleAuthenticated`, at which point we store the
 *               session and flip `page` to 'dashboard'.
 *
 *  Login  ──onNavigateSignup──▶ Register
 *  Register ──onNavigateLogin──▶ Login
 *  Login/Register ──onAuthenticated(session)──▶ Dashboard
 *  Dashboard ──onSignOut──▶ Login (session cleared)
 * ────────────────────────────────────────────────────────────────────────
 */
function App() {
  const [page, setPage] = useState<Page>('login')
  const [session, setSession] = useState<Session | null>(null)
  const [resetToken, setResetToken] = useState('')

  const handleAuthenticated = (nextSession: Session) => {
    setSession(nextSession)
    setPage('dashboard')
  }

  const handleNavigateResetPassword = (nextToken: string) => {
    setResetToken(nextToken)
    setPage('reset-password')
  }

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
      {page === 'login' && (
        <Login
          onAuthenticated={handleAuthenticated}
          onNavigateSignup={() => setPage('signup')}
          onNavigateForgotPassword={() => setPage('forgot-password')}
        />
      )}

      {page === 'signup' && (
        <Register onAuthenticated={handleAuthenticated} onNavigateLogin={() => setPage('login')} />
      )}

      {page === 'forgot-password' && (
        <ForgotPassword
          onNavigateLogin={() => setPage('login')}
          onNavigateResetPassword={handleNavigateResetPassword}
        />
      )}

      {page === 'reset-password' && (
        <ResetPassword
          token={resetToken}
          onNavigateLogin={() => {
            setResetToken('')
            setPage('login')
          }}
        />
      )}

      {page === 'dashboard' && session && (
        <Dashboard
          session={session}
          onSignOut={() => {
            setSession(null)
            setPage('login')
          }}
        />
      )}
    </div>
  )
}

export default App

import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
<<<<<<< HEAD
=======
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
>>>>>>> 56b13b4c38d7dd932e10dade3569466fe9cac98c
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
<<<<<<< HEAD

  // Shared handler passed to both auth screens. Simulates a successful auth,
  // captures the resulting session, then routes to the dashboard.
=======
  const [resetToken, setResetToken] = useState('')

>>>>>>> 56b13b4c38d7dd932e10dade3569466fe9cac98c
  const handleAuthenticated = (nextSession: Session) => {
    setSession(nextSession)
    setPage('dashboard')
  }

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
      {page === 'login' && (
        <Login onAuthenticated={handleAuthenticated} onNavigateSignup={() => setPage('signup')} />
=======
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
>>>>>>> 56b13b4c38d7dd932e10dade3569466fe9cac98c
      )}

      {page === 'signup' && (
        <Register onAuthenticated={handleAuthenticated} onNavigateLogin={() => setPage('login')} />
      )}

<<<<<<< HEAD
=======
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

>>>>>>> 56b13b4c38d7dd932e10dade3569466fe9cac98c
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

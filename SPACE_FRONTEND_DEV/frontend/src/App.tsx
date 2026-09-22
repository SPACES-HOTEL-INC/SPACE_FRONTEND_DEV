import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import type { Page, Session } from './types'

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
        <Register 
          onAuthenticated={handleAuthenticated} 
          onNavigateLogin={() => setPage('login')} 
        />
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

      {/* Fallback route if page is 'dashboard' but session is null */}
      {page === 'dashboard' && !session && (
        <Login
          onAuthenticated={handleAuthenticated}
          onNavigateSignup={() => setPage('signup')}
          onNavigateForgotPassword={() => setPage('forgot-password')}
        />
      )}
    </div>
  )
}

export default App
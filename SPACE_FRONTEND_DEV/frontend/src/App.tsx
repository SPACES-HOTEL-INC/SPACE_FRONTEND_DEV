import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import OtpVerification from './components/auth/OtpVerification'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import type { Session } from './types'

// Extended page type to include 'otp'
type Page = 'login' | 'signup' | 'otp' | 'forgot-password' | 'reset-password' | 'dashboard'

const SESSION_STORAGE_KEY = 'spaces-hm-session'

function readStoredSession(): Session | null {
  try {
    const stored =
      window.localStorage.getItem(SESSION_STORAGE_KEY) ||
      window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!stored) return null

    const session: unknown = JSON.parse(stored)
    return session && typeof session === 'object' && !Array.isArray(session)
      ? (session as Session)
      : null
  } catch {
    return null
  }
}

function App() {
  const [session, setSession] = useState<Session | null>(readStoredSession)
  const [page, setPage] = useState<Page>(() => (session ? 'dashboard' : 'login'))
  const [resetToken, setResetToken] = useState('')
  const [otpEmail, setOtpEmail] = useState('')

  const handleAuthenticated = (nextSession: Session, remember = true) => {
    try {
      const storage = remember ? window.localStorage : window.sessionStorage
      const otherStorage = remember ? window.sessionStorage : window.localStorage
      otherStorage.removeItem(SESSION_STORAGE_KEY)
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession))
    } catch (error) {
      console.error('Unable to persist the signed-in session:', error)
    }
    setSession(nextSession)
    setPage('dashboard')
  }

  const handleSignOut = () => {
    for (const storage of [window.localStorage, window.sessionStorage]) {
      storage.removeItem(SESSION_STORAGE_KEY)
      storage.removeItem('token')
      storage.removeItem('access_token')
    }
    setSession(null)
    setPage('login')
  }

  const handleNavigateOtp = (email: string) => {
    setOtpEmail(email)
    setPage('otp')
  }

  const handleNavigateResetPassword = (nextToken: string) => {
    setResetToken(nextToken)
    setPage('reset-password')
  }

  return (
    <div className="h-screen h-[100dvh] w-screen overflow-hidden bg-canvas font-sans text-ink antialiased">
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
          onNavigateOtp={handleNavigateOtp}
        />
      )}

      {page === 'otp' && (
        <div className="flex h-full w-full items-center justify-center p-4">
          <OtpVerification
            email={otpEmail}
            onNavigateLogin={() => {
              setOtpEmail('')
              setPage('login')
            }}
          />
        </div>
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
          onSignOut={handleSignOut}
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
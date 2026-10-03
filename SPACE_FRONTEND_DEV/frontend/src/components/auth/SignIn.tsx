import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import FormField from './FormField'
import { inputClass } from '../../lib/ui'
import { DEMO_SESSION } from '../../data/mockData'
import { API_BASE_URL } from '../../lib/api'
import type { Session } from '../../types'

interface SignInProps {
  onAuthenticated: (session: Session, remember: boolean) => void
  onNavigateSignup: () => void
  onNavigateForgotPassword: () => void
}

export default function SignIn({ onAuthenticated, onNavigateSignup, onNavigateForgotPassword }: SignInProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      const data = await response.json().catch(() => ({}))
      const accessToken = data.access_token || data.token
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Invalid email or password.')
      }

      if (typeof accessToken !== 'string' || !accessToken) {
        throw new Error('Sign-in response did not include an authentication token.')
      }

      localStorage.removeItem('token')
      localStorage.removeItem('access_token')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('access_token')
      if (remember) {
        localStorage.setItem('access_token', accessToken)
      } else {
        sessionStorage.setItem('access_token', accessToken)
      }

      const managerName = data.user?.full_name || data.full_name

      onAuthenticated({
        ...DEMO_SESSION,
        token: accessToken,
        email: data.email || email.trim(),
        userId: data.id || data.user?.id || DEMO_SESSION.userId,
        merchantId: data.id || DEMO_SESSION.merchantId,
        hotelName: managerName ? `${managerName}'s Property` : DEMO_SESSION.hotelName,
        user: {
          id: data.user?.id || data.id,
          email: data.user?.email || data.email || email.trim(),
          full_name: managerName,
        },
      }, remember)
    } catch (err: any) {
      console.error('Login error:', err)
      setErrorMessage(err.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md animate-rise my-auto" data-testid="login-card">
      <header className="mb-4 sm:mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500 sm:text-[15px]">
          Sign in to your Spaces Hm business account.
        </p>
      </header>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4" data-testid="login-form">
        <FormField label="Business Email" htmlFor="email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className={`${inputClass} pl-11`}
              data-testid="login-email-input"
            />
          </div>
        </FormField>

        <FormField label="Password" htmlFor="password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`${inputClass} pl-11 pr-11`}
              data-testid="login-password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              data-testid="toggle-password-visibility"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs text-slate-600 sm:text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-[18px] w-[18px] rounded border-line text-brand-600 focus:ring-brand-600/30"
              data-testid="remember-me-checkbox"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={onNavigateForgotPassword}
            className="text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 sm:text-sm"
            data-testid="forgot-password-link"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 hover:shadow-[0_14px_30px_-10px_rgba(15,118,110,0.9)] focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.99] disabled:cursor-wait disabled:opacity-80 sm:py-3.5 sm:text-[15px]"
          data-testid="enter-console-button"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Signing you in…
            </>
          ) : (
            <>
              Login Business Account
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500 sm:mt-6 sm:text-sm">
        New to Spaces Hm?{' '}
        <button
          type="button"
          onClick={onNavigateSignup}
          className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
          data-testid="go-to-signup-link"
        >
          Create a business account
        </button>
      </p>
    </div>
  )
}
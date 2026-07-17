import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import FormField from './FormField'
import { inputClass } from '../../lib/ui'
import { DEMO_SESSION } from '../../data/mockData'
import type { Session } from '../../types'

interface SignInProps {
  // Bubbles a (mock) authenticated session up to App -> routes to dashboard.
  onAuthenticated: (session: Session) => void
  onNavigateSignup: () => void
}

/**
 * SignIn — the elegant login card.
 * On submit it simulates a short auth request, then hands a Session up to App.
 */
export default function SignIn({ onAuthenticated, onNavigateSignup }: SignInProps) {
  const [email, setEmail] = useState('owner@grandregent.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulated authentication — replace with a real API call later.
    setTimeout(() => {
      onAuthenticated({ ...DEMO_SESSION, email: email || DEMO_SESSION.email })
    }, 650)
  }

  return (
    <div className="w-full max-w-md animate-rise" data-testid="login-card">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">Welcome back</h2>
        <p className="mt-2 text-[15px] text-slate-500">
          Sign in to your Spaces Hm business account.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
        <FormField label="Business Email" htmlFor="email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourhotel.com"
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

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-slate-600">
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
            className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            data-testid="forgot-password-link"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 hover:shadow-[0_14px_30px_-10px_rgba(15,118,110,0.9)] focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
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

      <p className="mt-8 text-center text-sm text-slate-500">
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

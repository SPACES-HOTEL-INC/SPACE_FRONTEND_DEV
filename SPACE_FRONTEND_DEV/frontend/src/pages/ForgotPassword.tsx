import { ArrowLeft, Mail, Send, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'
import { inputClass } from '../lib/ui'
import { useState } from 'react'

const API_FORGOT_PASSWORD_URL = 'https://backend-nq9s.onrender.com/api/v1/auth/forgot-password'

interface ForgotPasswordProps {
  onNavigateLogin: () => void
  onNavigateResetPassword: (token: string) => void
}

export default function ForgotPassword({ onNavigateLogin, onNavigateResetPassword }: ForgotPasswordProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetToken, setResetToken] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(API_FORGOT_PASSWORD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Unable to send password reset instructions.')
      }

      const nextResetToken = typeof data?.reset_token === 'string' ? data.reset_token : ''
      setResetToken(nextResetToken)
      setSubmitted(true)
    } catch (error: any) {
      console.error('Forgot password request failed:', error)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-rise" data-testid="forgot-password-card">
        <button
          type="button"
          onClick={onNavigateLogin}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          data-testid="back-to-login-link"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>

        {!submitted ? (
          <>
            <header className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Account recovery</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">Forgot password?</h2>
              <p className="mt-2 text-[15px] text-slate-500">
                Enter the email linked to your business account and we’ll send reset instructions.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5" data-testid="forgot-password-form">
              <FormField label="Business Email" htmlFor="reset-email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className={`${inputClass} pl-11`}
                    data-testid="forgot-password-email-input"
                  />
                </div>
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                data-testid="send-reset-link-button"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </>
        ) : (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-sm" data-testid="password-reset-success">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-ink">Check your inbox</h3>
            <p className="mt-2 text-sm text-slate-600">
              We sent a password reset link to <span className="font-semibold text-slate-800">{email}</span>.
            </p>

            {resetToken && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-3 text-left">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Reset token</p>
                <p className="mt-2 break-all text-xs text-slate-700">{resetToken}</p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {resetToken && (
                <button
                  type="button"
                  onClick={() => onNavigateResetPassword(resetToken)}
                  className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                  data-testid="continue-to-reset-button"
                >
                  Continue to reset
                </button>
              )}
              <button
                type="button"
                onClick={onNavigateLogin}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                data-testid="return-to-login-button"
              >
                Return to login
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

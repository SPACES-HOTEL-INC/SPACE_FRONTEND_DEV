import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react'
import AuthLayout from '../components/auth/AuthLayout'
import FormField from '../components/auth/FormField'
import { inputClass } from '../lib/ui'

const API_RESET_PASSWORD_URL = 'https://backend-nq9s.onrender.com/api/v1/auth/reset-password'

interface ResetPasswordProps {
  token?: string
  onNavigateLogin: () => void
}

export default function ResetPassword({ token = '', onNavigateLogin }: ResetPasswordProps) {
  const [resetToken, setResetToken] = useState(token)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const normalizedToken = useMemo(() => resetToken.trim(), [resetToken])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!normalizedToken) {
      setError('Reset token is missing. Paste the token from the email or the previous step.')
      return
    }

    if (newPassword.length < 8) {
      setError('Choose a password with at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(API_RESET_PASSWORD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: normalizedToken,
          new_password: newPassword,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Unable to reset your password.')
      }

      setSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      setResetToken(normalizedToken)
    } catch (caughtError: any) {
      setError(caughtError.message || 'Unable to update your password right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-rise" data-testid="reset-password-card">
        <button
          type="button"
          onClick={onNavigateLogin}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          data-testid="reset-back-to-login-link"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>

        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-sm" data-testid="reset-password-success">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-ink">Password restored</h3>
            <p className="mt-2 text-sm text-slate-600">
              Your password has been updated successfully. You can now sign in with your new credentials.
            </p>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              data-testid="reset-success-return-to-login-button"
            >
              Return to login
            </button>
          </div>
        ) : (
          <>
            <header className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Account recovery</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">Set a new password</h2>
              <p className="mt-2 text-[15px] text-slate-500">
                Enter the reset token and choose a strong password for your account.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5" data-testid="reset-password-form">
              <FormField label="Reset token" htmlFor="reset-token">
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reset-token"
                    type="text"
                    value={resetToken}
                    onChange={(event) => setResetToken(event.target.value)}
                    placeholder="Paste your reset token"
                    className={`${inputClass} pl-11`}
                    data-testid="reset-token-input"
                  />
                </div>
              </FormField>

              <FormField label="New password" htmlFor="new-password">
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter a new password"
                    className={`${inputClass} pr-11`}
                    data-testid="new-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((currentValue) => !currentValue)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormField>

              <FormField label="Confirm password" htmlFor="confirm-password">
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm your password"
                    className={`${inputClass} pr-11`}
                    data-testid="confirm-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((currentValue) => !currentValue)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormField>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" data-testid="reset-password-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                data-testid="reset-password-submit-button"
              >
                {loading ? 'Updating password…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

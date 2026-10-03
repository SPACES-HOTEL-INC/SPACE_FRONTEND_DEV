import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Loader2, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Session } from '../../types'

interface OtpVerificationProps {
  email: string
  onAuthenticated: (session: Session) => void
  onNavigateLogin: () => void
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-nq9s.onrender.com'

export default function OtpVerification({
  email,
  onAuthenticated,
  onNavigateLogin,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [timer, setTimer] = useState(60)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for OTP resend capability
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  // Handle single digit inputs and focus shifts
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only digits allowed

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)
    setError(null)

    // Automatically focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace key navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste events (e.g., pasting 6-digit code)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (!/^\d{6}$/.test(pastedData)) return

    const digits = pastedData.split('')
    setOtp(digits)
    inputRefs.current[5]?.focus()
  }

  // POST /api/v1/auth/verify-otp
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) {
      setError('Please enter the full 6-digit verification code.')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp_code: code,
        }),
      })

      const resData = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          resData.detail || resData.message || 'Verification failed. Please check your code.'
        )
      }

      setSuccessMessage('Account verified successfully!')

      // If response returns access token / user payload:
      if (resData.access_token || resData.token) {
        const token = resData.access_token || resData.token
        localStorage.setItem('token', token)
        onAuthenticated({
          token,
          user: resData.user || { email },
          hotelName: resData.user?.full_name || 'My Business',
        })
      } else {
        // Fallback: navigate to login after brief success notification
        setTimeout(() => {
          onNavigateLogin()
        }, 1500)
      }
    } catch (err: any) {
      console.error('OTP Verification Error:', err)
      setError(err.message || 'Unable to verify OTP. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // POST /api/v1/auth/resend-otp
  const handleResend = async () => {
    if (timer > 0 || resending) return

    setResending(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const resData = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(resData.detail || resData.message || 'Could not resend OTP.')
      }

      setSuccessMessage('A new OTP has been sent to your email.')
      setTimer(60)
      setOtp(Array(6).fill(''))
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      console.error('OTP Resend Error:', err)
      setError(err.message || 'Failed to resend OTP. Please try again later.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="w-full max-w-lg animate-rise my-auto" data-testid="otp-verification-card">
      {/* Back Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onNavigateLogin}
          className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700 focus:outline-none"
          data-testid="otp-back-button"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Back to Sign In</span>
        </button>
      </div>

      <header className="mb-7">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">Verify your email</h2>
        <p className="mt-2 text-[15px] text-slate-500">
          We sent a 6-digit code to{' '}
          <span className="font-semibold text-slate-700">{email || 'your email'}</span>.
        </p>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <p>{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* OTP Input Fields */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-12 w-12 rounded-xl border border-slate-200 text-center text-xl font-bold text-ink outline-none transition-all focus:border-brand-600 focus:ring-4 focus:ring-brand-600/15 sm:h-14 sm:w-14 sm:text-2xl"
              data-testid={`otp-input-${index}`}
            />
          ))}
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={submitting || otp.join('').length < 6}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 hover:shadow-[0_14px_30px_-10px_rgba(15,118,110,0.9)] focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="verify-otp-button"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Verifying…
            </>
          ) : (
            <>Verify Account</>
          )}
        </button>
      </form>

      {/* Resend OTP Section */}
      <div className="mt-7 text-center text-sm text-slate-500">
        Didn't receive the code?{' '}
        {timer > 0 ? (
          <span className="font-semibold text-slate-700">Resend in {timer}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold text-brand-600 transition-colors hover:text-brand-700 focus:outline-none disabled:opacity-50"
            data-testid="resend-otp-button"
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        )}
      </div>
    </div>
  )
}
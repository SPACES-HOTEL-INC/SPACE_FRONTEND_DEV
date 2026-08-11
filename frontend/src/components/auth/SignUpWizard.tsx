import { useState } from 'react'
import {
  User,
  Phone,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import FormField from './FormField'
import { inputClass } from '../../lib/ui'
import type { RegistrationData, Session } from '../../types'

interface SignUpWizardProps {
  onAuthenticated: (session: Session) => void
  onNavigateLogin: () => void
}

const INITIAL_DATA: RegistrationData & { email?: string; confirmPassword?: string } = {
  email: '',
  firstName: '',
  lastName: '', 
  mobile: '',
  password: '',
  confirmPassword: '',
  hotelName: '',
  propertyType: '',
  starRating: '',
  address: '',
  taxId: '',
  documentName: '',
}

// Adjust this URL to match your environment variables or configuration
const API_REGISTER_URL = 'https://backend-nq9s.onrender.com/api/v1/auth/register'

export default function SignUpWizard({ onAuthenticated, onNavigateLogin }: SignUpWizardProps) {
  const [data, setData] = useState(INITIAL_DATA)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (patch: Partial<typeof INITIAL_DATA>) => {
    setError('')
    setData((prev) => ({ ...prev, ...patch }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password match
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match. Please check and try again.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // 1. Map frontend state to backend UserCreate schema
      const payload = {
        email: data.email?.trim(),
        password: data.password,
        full_name: `${data.firstName} ${data.lastName}`.trim(),
        phone_number: data.mobile,
        // Since this is a business account registration, you may want to set the role to 'host' 
        // rather than the default 'consumer' depending on your backend logic.
        role: 'host' 
      }

      // 2. Send authentication request to backend
      const response = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Handle the backend's validation error structure (422 Unprocessable Entity)
        if (errorData.detail && Array.isArray(errorData.detail)) {
           throw new Error(errorData.detail[0].msg || 'Validation Error')
        }
        
        throw new Error(errorData.detail || errorData.message || 'Registration failed.')
      }

      // 3. Handle Successful Registration
      // Because the /register endpoint returns the user object and NOT an access token, 
      // the best practice is to navigate the user to the login screen to authenticate.
      onNavigateLogin()

    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Unable to create account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-lg animate-rise" data-testid="signup-wizard">
      <header className="mb-7">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">Create your business account</h2>
        <p className="mt-2 text-[15px] text-slate-500">
          A few quick steps to onboard your property.
        </p>
      </header>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="First Name" htmlFor="firstName">
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="firstName"
                required
                value={data.firstName}
                onChange={(e) => update({ firstName: e.target.value })}
                placeholder="Jordan"
                className={`${inputClass} pl-11`}
                data-testid="signup-firstname-input"
              />
            </div>
          </FormField>
          <FormField label="Last Name" htmlFor="lastName">
            <input
              id="lastName"
              required
              value={data.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
              placeholder="Reyes"
              className={inputClass}
              data-testid="signup-lastname-input"
            />
          </FormField>
        </div>

        {/* Email Address */}
        <FormField label="Email Address" htmlFor="email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              required
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="user@example.com"
              className={`${inputClass} pl-11`}
              data-testid="signup-email-input"
            />
          </div>
        </FormField>

        {/* Business Mobile */}
        <FormField label="Business Mobile" htmlFor="mobile">
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="mobile"
              type="tel"
              required
              value={data.mobile}
              onChange={(e) => update({ mobile: e.target.value })}
              placeholder="+1 (555) 000-1234"
              className={`${inputClass} pl-11`}
              data-testid="signup-mobile-input"
            />
          </div>
        </FormField>

        {/* Password */}
        <FormField label="Password" htmlFor="signupPassword" hint="Use at least 8 characters.">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="signupPassword"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={data.password}
              onChange={(e) => update({ password: e.target.value })}
              placeholder="Create a password"
              className={`${inputClass} pl-11 pr-11`}
              data-testid="signup-password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              data-testid="toggle-signup-password-visibility"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </FormField>

        {/* Confirm Password */}
        <FormField label="Confirm Password" htmlFor="confirmPassword">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={data.confirmPassword}
              onChange={(e) => update({ confirmPassword: e.target.value })}
              placeholder="Re-enter your password"
              className={`${inputClass} pl-11 pr-11`}
              data-testid="signup-confirmpassword-input"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              data-testid="toggle-signup-confirmpassword-visibility"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </FormField>

        {/* Submit action */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            data-testid="signup-submit-button"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Creating account…
              </>
            ) : (
              <>Sign Up &amp; Access Account</>
            )}
          </button>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onNavigateLogin}
          className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
          data-testid="go-to-login-link"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
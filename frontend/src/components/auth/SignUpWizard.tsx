import { useState } from 'react'
import {
  User,
  Phone,
  Lock,
  Building2,
  MapPin,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileCheck2,
  ShieldCheck,
  Loader2,
} from 'lucide-react'
import FormField from './FormField'
import StepperTracker from './StepperTracker'
import { inputClass, selectClass } from '../../lib/ui'
import { PROPERTY_TYPES, STAR_RATINGS } from '../../data/mockData'
import type { RegistrationData, Session } from '../../types'

interface SignUpWizardProps {
  onAuthenticated: (session: Session) => void
  onNavigateLogin: () => void
}

const STEPS = [
  { id: 1, label: 'Admin Account' },
  { id: 2, label: 'Hotel Profile' },
  { id: 3, label: 'Verification & KYC' },
]

const INITIAL_DATA: RegistrationData = {
  firstName: '',
  lastName: '',
  mobile: '',
  password: '',
  hotelName: '',
  propertyType: '',
  starRating: '',
  address: '',
  taxId: '',
  documentName: '',
}

/**
 * SignUpWizard — the 3-step registration flow.
 *
 * State flow:
 *  • `step` (1|2|3)  → controls which step renders + drives the StepperTracker.
 *  • `data`          → ONE centralized object holding every field across all
 *                      steps. Because it lives at the wizard level (not per
 *                      step), values are preserved when the user clicks
 *                      Back/Next. `update()` patches individual keys.
 *  • On final submit → build a Session from the collected data and hand it to
 *                      App via onAuthenticated (routes to the dashboard).
 */
export default function SignUpWizard({ onAuthenticated, onNavigateLogin }: SignUpWizardProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<RegistrationData>(INITIAL_DATA)
  const [submitting, setSubmitting] = useState(false)

  const update = (patch: Partial<RegistrationData>) => setData((prev) => ({ ...prev, ...patch }))

  const next = () => setStep((s) => Math.min(3, s + 1))
  const back = () => setStep((s) => Math.max(1, s - 1))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulated account creation -> derive the merchant session from form data.
    setTimeout(() => {
      onAuthenticated({
        hotelName: data.hotelName || 'Grand Regent Hotel',
        merchantId: 'MER-' + Math.floor(1000 + Math.random() * 8999) + '-NEW',
        email: `${data.firstName || 'owner'}@${(data.hotelName || 'hotel').replace(/\s+/g, '').toLowerCase()}.com`,
      })
    }, 800)
  }

  return (
    <div className="w-full max-w-lg animate-rise" data-testid="signup-wizard">
      <header className="mb-7">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">Create your console</h2>
        <p className="mt-2 text-[15px] text-slate-500">
          A few quick steps to onboard your property.
        </p>
      </header>

      {/* Status stepper reflects the `step` state */}
      <StepperTracker steps={STEPS} current={step} />

      <form onSubmit={handleSubmit} className="mt-8">
        {/* key={step} restarts the entrance animation on each step change */}
        <div key={step} className="animate-rise space-y-5">
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="First Name" htmlFor="firstName">
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="firstName"
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
                    value={data.lastName}
                    onChange={(e) => update({ lastName: e.target.value })}
                    placeholder="Reyes"
                    className={inputClass}
                    data-testid="signup-lastname-input"
                  />
                </FormField>
              </div>

              <FormField label="Business Mobile" htmlFor="mobile">
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="mobile"
                    type="tel"
                    value={data.mobile}
                    onChange={(e) => update({ mobile: e.target.value })}
                    placeholder="+1 (555) 000-1234"
                    className={`${inputClass} pl-11`}
                    data-testid="signup-mobile-input"
                  />
                </div>
              </FormField>

              <FormField label="Password" htmlFor="signupPassword" hint="Use at least 8 characters.">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="signupPassword"
                    type="password"
                    value={data.password}
                    onChange={(e) => update({ password: e.target.value })}
                    placeholder="Create a password"
                    className={`${inputClass} pl-11`}
                    data-testid="signup-password-input"
                  />
                </div>
              </FormField>
            </>
          )}

          {step === 2 && (
            <>
              <FormField label="Official Hotel / Estate Name" htmlFor="hotelName">
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="hotelName"
                    value={data.hotelName}
                    onChange={(e) => update({ hotelName: e.target.value })}
                    placeholder="Grand Regent Hotel"
                    className={`${inputClass} pl-11`}
                    data-testid="signup-hotelname-input"
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Property Type" htmlFor="propertyType">
                  <div className="relative">
                    <select
                      id="propertyType"
                      value={data.propertyType}
                      onChange={(e) => update({ propertyType: e.target.value })}
                      className={selectClass}
                      data-testid="signup-propertytype-select"
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>
                </FormField>

                <FormField label="Star Rating" htmlFor="starRating">
                  <div className="relative">
                    <select
                      id="starRating"
                      value={data.starRating}
                      onChange={(e) => update({ starRating: e.target.value })}
                      className={selectClass}
                      data-testid="signup-starrating-select"
                    >
                      <option value="" disabled>
                        Select rating
                      </option>
                      {STAR_RATINGS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>
                </FormField>
              </div>

              <FormField label="Physical Address" htmlFor="address">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-4 h-5 w-5 text-slate-400" />
                  <textarea
                    id="address"
                    rows={3}
                    value={data.address}
                    onChange={(e) => update({ address: e.target.value })}
                    placeholder="Street, city, state, postal code"
                    className={`${inputClass} resize-none pl-11`}
                    data-testid="signup-address-input"
                  />
                </div>
              </FormField>
            </>
          )}

          {step === 3 && (
            <>
              <FormField
                label="Corporate Registration / Tax ID"
                htmlFor="taxId"
                hint="Used to verify your business for payouts."
              >
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="taxId"
                    value={data.taxId}
                    onChange={(e) => update({ taxId: e.target.value })}
                    placeholder="e.g. TAX-99-2048571"
                    className={`${inputClass} pl-11`}
                    data-testid="signup-taxid-input"
                  />
                </div>
              </FormField>

              {/* File-upload dropzone (mock — stores only the file name) */}
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Business Documents
                </span>
                <label
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-slate-50 px-6 py-9 text-center transition-colors hover:border-brand-600 hover:bg-brand-50/40"
                  data-testid="signup-dropzone"
                >
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => update({ documentName: e.target.files?.[0]?.name ?? '' })}
                    data-testid="signup-file-input"
                  />
                  {data.documentName ? (
                    <>
                      <FileCheck2 className="h-8 w-8 text-brand-600" />
                      <p className="text-sm font-semibold text-ink" data-testid="uploaded-file-name">
                        {data.documentName}
                      </p>
                      <p className="text-xs text-slate-500">Click to replace file</p>
                    </>
                  ) : (
                    <>
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600/10">
                        <UploadCloud className="h-6 w-6 text-brand-600" />
                      </span>
                      <p className="text-sm font-semibold text-ink">
                        Drag &amp; drop or{' '}
                        <span className="text-brand-600">browse to upload</span>
                      </p>
                      <p className="text-xs text-slate-500">PDF, JPG or PNG · up to 10MB</p>
                    </>
                  )}
                </label>
              </div>
            </>
          )}
        </div>

        {/* Navigation controls — Back appears from step 2 onward */}
        <div className="mt-8 flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 text-[15px] font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99]"
              data-testid="wizard-back-button"
            >
              <ArrowLeft className="h-5 w-5" /> Back
            </button>
          )}

          {step < 3 ? (
            <button
              key="wizard-next"
              type="button"
              onClick={next}
              className="group ml-auto flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.99]"
              data-testid="wizard-next-button"
            >
              Next
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              key="wizard-submit"
              type="submit"
              disabled={submitting}
              className="ml-auto flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              data-testid="wizard-submit-button"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Creating console…
                </>
              ) : (
                <>Submit &amp; Access Console</>
              )}
            </button>
          )}
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

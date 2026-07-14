import type { ReactNode } from 'react'
import { labelClass } from '../../lib/ui'

interface FormFieldProps {
  label: string
  htmlFor?: string
  hint?: string
  children: ReactNode
}

// Thin wrapper that gives every control a consistent label + optional hint.
// The actual <input>/<select> is passed as children (using inputClass /
// selectClass) so we keep one source of truth for control styling.
export default function FormField({ label, htmlFor, hint, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

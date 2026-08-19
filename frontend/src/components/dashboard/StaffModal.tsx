import { useState, useEffect } from 'react'
import { X, UserCheck, Mail, Lock, Building, Eye, EyeOff, ChevronDown } from 'lucide-react'
import FormField from '../auth/FormField'
import { inputClass } from '../../lib/ui'
import type { Branch } from '../../types'

interface StaffModalProps {
  isOpen: boolean
  onClose: () => void
  branches: Branch[]
  onCreateStaff: (staffData: { name: string; email: string; pass: string; branchId: string }) => void
}

export default function StaffModal({
  isOpen,
  onClose,
  branches,
  onCreateStaff,
}: StaffModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || '')
  const [showPassword, setShowPassword] = useState(false)

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateStaff({ name, email, pass: password, branchId: selectedBranch })
    setName('')
    setEmail('')
    setPassword('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-rise border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">Create Receptionist Profile</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Assigned Property Branch Select Field */}
          <FormField label="Assigned Property Branch" htmlFor="branch">
            <div className="relative flex items-center w-full">
              <Building className="pointer-events-none absolute left-3.5 z-10 h-5 w-5 text-slate-400" />
              <select
                id="branch"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className={`${inputClass} pl-11 pr-10 appearance-none w-full truncate cursor-pointer bg-white text-slate-800`}
                required
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.propertyType})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 z-10 h-4 w-4 text-slate-400" />
            </div>
          </FormField>

          {/* Full Name */}
          <FormField label="Receptionist Full Name" htmlFor="staffName">
            <div className="relative flex items-center w-full">
              <UserCheck className="pointer-events-none absolute left-3.5 z-10 h-5 w-5 text-slate-400" />
              <input
                id="staffName"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mary Johnson"
                className={`${inputClass} pl-11 w-full`}
              />
            </div>
          </FormField>

          {/* Email */}
          <FormField label="Branch Email Address" htmlFor="staffEmail">
            <div className="relative flex items-center w-full">
              <Mail className="pointer-events-none absolute left-3.5 z-10 h-5 w-5 text-slate-400" />
              <input
                id="staffEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reception.ikeja@grandregent.com"
                className={`${inputClass} pl-11 w-full`}
              />
            </div>
          </FormField>

          {/* Password */}
          <FormField label="Initial Password" htmlFor="staffPassword">
            <div className="relative flex items-center w-full">
              <Lock className="pointer-events-none absolute left-3.5 z-10 h-5 w-5 text-slate-400" />
              <input
                id="staffPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create temporary password"
                className={`${inputClass} pl-11 pr-11 w-full`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors z-10"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </FormField>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-all active:scale-[0.99]"
            >
              Create Account &amp; Assign Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
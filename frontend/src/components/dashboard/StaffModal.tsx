import { useState } from 'react'
import { X, UserCheck, Mail, Lock, Building, Eye, EyeOff } from 'lucide-react'
import FormField from '../auth/FormField'
import { inputClass, selectClass } from '../../lib/ui'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-rise">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">Create Receptionist Profile</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <FormField label="Assigned Property Branch" htmlFor="branch">
            <div className="relative">
              <Building className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <select
                id="branch"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className={`${selectClass} pl-11`}
                required
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.propertyType})
                  </option>
                ))}
              </select>
            </div>
          </FormField>

          <FormField label="Receptionist Full Name" htmlFor="staffName">
            <div className="relative">
              <UserCheck className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="staffName"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mary Johnson"
                className={`${inputClass} pl-11`}
              />
            </div>
          </FormField>

          <FormField label="Branch Email Address" htmlFor="staffEmail">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="staffEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reception.ikeja@grandregent.com"
                className={`${inputClass} pl-11`}
              />
            </div>
          </FormField>

          <FormField label="Initial Password" htmlFor="staffPassword">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="staffPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create temporary password"
                className={`${inputClass} pl-11 pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </FormField>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Create Account &amp; Assign Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
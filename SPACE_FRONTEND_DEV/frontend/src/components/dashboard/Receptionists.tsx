import { Users, Plus, Mail, ShieldCheck, MapPin, Sparkles } from 'lucide-react'

interface StaffAccount {
  id: string
  name: string
  email: string
  role: 'CEO' | 'RECEPTIONIST'
  branchId: string
  createdAt: string
}

interface ReceptionistsProps {
  staffAccounts: StaffAccount[]
  onOpenStaffModal: () => void
}

export default function Receptionists({ staffAccounts, onOpenStaffModal }: ReceptionistsProps) {
  const staffList = staffAccounts.length > 0 ? staffAccounts : []

  return (
    <section className="space-y-6" data-testid="receptionists-panel">
      <div className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Team</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Receptionists</h2>
        </div>

        <button
          type="button"
          onClick={onOpenStaffModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          data-testid="create-receptionist-button"
        >
          <Plus className="h-4 w-4" />
          Create receptionist profile
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {staffList.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center shadow-card-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">No receptionists yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              Invite your first front-desk staff member to manage arrivals, check-ins, and guest operations.
            </p>
            <button
              type="button"
              onClick={onOpenStaffModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add receptionist
            </button>
          </div>
        ) : (
          staffList.map((staff) => (
            <article
              key={staff.id}
              className="rounded-3xl border border-line bg-white p-5 shadow-card"
              data-testid={`receptionist-card-${staff.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-base font-bold text-brand-700">
                  {staff.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Active
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-ink">{staff.name}</h3>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="h-4 w-4" />
                  {staff.email}
                </p>
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  Assigned branch: {staff.branchId || 'Unassigned'}
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-slate-400" />
                  Role: {staff.role}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

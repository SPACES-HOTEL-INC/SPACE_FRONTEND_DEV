import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import MiniHeader from '../components/dashboard/MiniHeader'
import OverviewView from '../components/dashboard/OverviewView'
import ManageRooms from '../components/dashboard/ManageRooms'
import Bookings from '../components/dashboard/Bookings'
import Payouts from '../components/dashboard/Payouts'
import StaffModal from '../components/dashboard/StaffModal'
import type { Session, Branch, StaffAccount } from '../types'

interface DashboardProps {
  session: Session
  onSignOut: () => void
}

interface Toast {
  title: string
  message: string
}

export default function Dashboard({ session, onSignOut }: DashboardProps) {
  const [activeNav, setActiveNav] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)

  const [branches] = useState<Branch[]>([
    {
      id: 'b1',
      name: 'Grand Regent Hotel - Ikeja',
      propertyType: 'Hotel',
      address: '15 Allen Avenue',
      city: 'Lagos',
    },
    {
      id: 'b2',
      name: 'Grand Regent Suites - Lekki',
      propertyType: 'Shortlet Apartment',
      address: 'Admiralty Way, Phase 1',
      city: 'Lagos',
    },
  ])

  const [, setStaffAccounts] = useState<StaffAccount[]>([])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const notify = (title: string, message: string) => setToast({ title, message })

  const handleCreateStaff = (staffData: {
    name: string
    email: string
    pass: string
    branchId: string
  }) => {
    const selectedBranch = branches.find((b) => b.id === staffData.branchId)
    const newStaff: StaffAccount = {
      id: `staff-${Date.now()}`,
      name: staffData.name,
      email: staffData.email,
      role: 'RECEPTIONIST',
      branchId: staffData.branchId,
      createdAt: new Date().toISOString(),
    }
    setStaffAccounts((prev) => [...prev, newStaff])
    notify(
      'Account Created',
      `Receptionist profile created for ${staffData.name} at ${selectedBranch?.name || 'assigned branch'}.`,
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar
        active={activeNav}
        onSelect={setActiveNav}
        mobileOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSignOut={onSignOut}
        session={session}
        onOpenStaffModal={() => setIsStaffModalOpen(true)}
      />

      <div className="lg:pl-[264px]">
        <MiniHeader session={session} onOpenMenu={() => setMenuOpen(true)} />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {activeNav === 'overview' && <OverviewView session={session} onNotify={notify} />}
          {(activeNav === 'rooms' || activeNav === 'property-type') && (
            <ManageRooms onNotify={notify} />
          )}
          {activeNav === 'bookings' && <Bookings onNotify={notify} />}
          {activeNav === 'payouts' && <Payouts onNotify={notify} />}
        </main>
      </div>

      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        branches={branches}
        onCreateStaff={handleCreateStaff}
      />

      {toast && (
        <div
          className="fixed bottom-5 right-5 z-[60] flex animate-toast-in items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3.5 shadow-card-lg sm:bottom-6 sm:right-6"
          data-testid="app-toast"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink" data-testid="app-toast-title">
              {toast.title}
            </p>
            <p className="text-xs text-slate-500" data-testid="app-toast-message">
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import MiniHeader from '../components/dashboard/MiniHeader'
import OverviewView from '../components/dashboard/OverviewView'
import ManageRooms from '../components/dashboard/ManageRooms'
import Bookings from '../components/dashboard/Bookings'
import Payouts from '../components/dashboard/Payouts'
import type { Session } from '../types'

interface DashboardProps {
  session: Session
  onSignOut: () => void
}

interface Toast {
  title: string
  message: string
}

/**
 * Dashboard — the executive command center + tab router.
 *
 * Local UI state:
 *  • `activeNav` → which sidebar tab is selected. This is the SINGLE SOURCE OF
 *                  TRUTH for which sub-panel renders in <main>
 *                  ('overview' | 'rooms' | 'bookings' | 'payouts').
 *  • `menuOpen`  → controls the mobile sidebar drawer.
 *  • `toast`     → transient confirmation surfaced by any child via `notify`
 *                  (room published, check-in/out, payout requested, etc.);
 *                  a timer auto-dismisses it.
 *
 * `session` flows in from App (set during login/signup) and feeds the header.
 */
export default function Dashboard({ session, onSignOut }: DashboardProps) {
  const [activeNav, setActiveNav] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  // Auto-dismiss the confirmation toast.
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  // Shared notifier passed down to every tab.
  const notify = (title: string, message: string) => setToast({ title, message })

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar
        active={activeNav}
        onSelect={setActiveNav}
        mobileOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSignOut={onSignOut}
      />

      {/* Content is offset by the fixed desktop rail width */}
      <div className="lg:pl-[264px]">
        <MiniHeader session={session} onOpenMenu={() => setMenuOpen(true)} />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Tab router: activeNav decides which sub-panel to show */}
          {activeNav === 'overview' && <OverviewView session={session} onNotify={notify} />}
          {activeNav === 'rooms' && <ManageRooms onNotify={notify} />}
          {activeNav === 'bookings' && <Bookings onNotify={notify} />}
          {activeNav === 'payouts' && <Payouts onNotify={notify} />}
        </main>
      </div>

      {/* Global confirmation toast (triggered by any tab) */}
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

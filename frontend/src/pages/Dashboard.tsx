import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import MiniHeader from '../components/dashboard/MiniHeader'
import StatsRow from '../components/dashboard/StatsRow'
import CheckInsQueue from '../components/dashboard/CheckInsQueue'
import type { Session } from '../types'

interface DashboardProps {
  session: Session
  onSignOut: () => void
}

/**
 * Dashboard — the executive command center.
 *
 * Local UI state:
 *  • `activeNav`   → which sidebar item is highlighted (Overview built out;
 *                    the rest are placeholders).
 *  • `menuOpen`    → controls the mobile sidebar drawer.
 *  • `toast`       → transient confirmation message. CheckInsQueue calls
 *                    `handleCheckIn` when a guest is checked in, which sets the
 *                    toast; a timer auto-dismisses it.
 *
 * `session` flows in from App (set during login/signup) and feeds the header.
 */
export default function Dashboard({ session, onSignOut }: DashboardProps) {
  const [activeNav, setActiveNav] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Auto-dismiss the confirmation toast.
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const handleCheckIn = (guest: string) => {
    setToast(`${guest} checked in successfully`)
  }

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
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Here's how {session.hotelName} is performing today.
              </p>
            </div>
            <span className="rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-semibold text-slate-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <StatsRow />
          <CheckInsQueue onCheckIn={handleCheckIn} />
        </main>
      </div>

      {/* Confirmation toast (triggered by check-ins) */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 z-50 flex animate-toast-in items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3.5 shadow-card-lg sm:bottom-6 sm:right-6"
          data-testid="checkin-toast"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Check-in complete</p>
            <p className="text-xs text-slate-500">{toast}</p>
          </div>
        </div>
      )}
    </div>
  )
}

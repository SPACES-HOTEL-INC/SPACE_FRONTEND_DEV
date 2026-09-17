import { useState } from 'react'
import { CheckCircle2, Clock, Users, LogIn } from 'lucide-react'
import { cn } from '../../lib/ui'
import { CHECK_INS } from '../../data/mockData'
import type { CheckIn } from '../../types'

interface CheckInsQueueProps {
  // Fires when a guest is checked in, so the Dashboard can surface a toast.
  onCheckIn: (guest: string) => void
}

/**
 * "Incoming Check-ins Today" queue.
 *
 * State flow: the list lives here as local state seeded from mock data. Pressing
 * "Check In" flips that row's status to 'checked-in' (button -> completed badge)
 * and calls `onCheckIn` so the parent Dashboard can pop a confirmation toast.
 *
 * Layout: a real table on lg+, and stacked "cards" on mobile for touch comfort.
 */
export default function CheckInsQueue({ onCheckIn }: CheckInsQueueProps) {
  const [rows, setRows] = useState<CheckIn[]>(CHECK_INS)

  const handleCheckIn = (row: CheckIn) => {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: 'checked-in' } : r)),
    )
    onCheckIn(row.guest)
  }

  const pendingCount = rows.filter((r) => r.status === 'pending').length

  return (
    <section
      className="mt-6 rounded-2xl border border-line bg-white shadow-card lg:mt-8"
      data-testid="checkins-queue"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-ink sm:text-lg">
            Incoming Check-ins Today
          </h2>
          <p className="text-xs text-slate-500">Arrivals expected across all properties</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/10 px-3 py-1 text-xs font-bold text-brand-700">
          {pendingCount} pending
        </span>
      </div>

      {/* Column header — desktop only */}
      <div className="hidden grid-cols-[1.6fr_1.4fr_1fr_0.9fr_auto] gap-4 border-b border-line px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 lg:grid">
        <span>Guest</span>
        <span>Room</span>
        <span>Arrival</span>
        <span>Party</span>
        <span className="text-right">Action</span>
      </div>

      <div className="divide-y divide-line">
        {rows.map((row) => {
          const done = row.status === 'checked-in'
          return (
            <div
              key={row.id}
              className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-slate-50/60 sm:px-6 lg:grid-cols-[1.6fr_1.4fr_1fr_0.9fr_auto] lg:items-center lg:gap-4"
              data-testid={`checkin-row-${row.id}`}
            >
              {/* Guest */}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'grid h-10 w-10 flex-none place-items-center rounded-full text-xs font-bold',
                    done ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-600/10 text-brand-700',
                  )}
                >
                  {row.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{row.guest}</p>
                  <p className="text-xs text-slate-500">{row.nights} night stay</p>
                </div>
              </div>

              {/* Room */}
              <div>
                <p className="text-sm font-semibold text-ink">{row.room}</p>
                <p className="text-xs text-slate-500">{row.roomType}</p>
              </div>

              {/* Arrival */}
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                {row.arrival}
              </div>

              {/* Party size */}
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Users className="h-4 w-4 text-slate-400" />
                {row.guests} {row.guests === 1 ? 'guest' : 'guests'}
              </div>

              {/* Action */}
              <div className="lg:text-right">
                {done ? (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-600/20"
                    data-testid={`checked-in-badge-${row.id}`}
                  >
                    <CheckCircle2 className="h-[18px] w-[18px]" /> Checked In
                  </span>
                ) : (
                  <button
                    onClick={() => handleCheckIn(row)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.98] lg:w-auto"
                    data-testid={`check-in-button-${row.id}`}
                  >
                    <LogIn className="h-4 w-4" /> Check In
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

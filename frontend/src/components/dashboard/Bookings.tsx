import { useMemo, useState } from 'react'
import { Search, ChevronDown, LogIn, LogOut, CalendarRange, Inbox } from 'lucide-react'
import { cn } from '../../lib/ui'
import { BOOKINGS, BOOKING_STATUSES } from '../../data/mockData'
import type { Booking, BookingStatus } from '../../types'

interface BookingsProps {
  onNotify: (title: string, message: string) => void
}

// Visual style per booking status.
const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Confirmed: 'bg-brand-50 text-brand-700 ring-brand-600/20',
  'Checked-In': 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Cancelled: 'bg-red-50 text-red-600 ring-red-600/20',
}

function StatusBadge({ status, id }: { status: BookingStatus; id: string }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1', STATUS_STYLES[status])}
      data-testid={`booking-status-${id}`}
    >
      {status}
    </span>
  )
}

/**
 * Bookings — the reservation ledger.
 *
 * State flow:
 *  • `rows` holds every booking (local, seeded from BOOKINGS).
 *  • `query` + `status` drive a derived `filtered` list (memoised) for the
 *    search box and status dropdown.
 *  • Inline actions mutate a single row's status: Confirmed → Checked-In,
 *    Checked-In → Completed. Each transition fires a toast via onNotify.
 */
export default function Bookings({ onNotify }: BookingsProps) {
  const [rows, setRows] = useState<Booking[]>(BOOKINGS)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | BookingStatus>('All')

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.guest.toLowerCase().includes(query.trim().toLowerCase()) &&
          (status === 'All' || r.status === status),
      ),
    [rows, query, status],
  )

  const setRowStatus = (id: string, next: BookingStatus) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)))

  const handleCheckIn = (b: Booking) => {
    setRowStatus(b.id, 'Checked-In')
    onNotify('Guest checked in', `${b.guest} is now Checked-In`)
  }
  const handleCheckOut = (b: Booking) => {
    setRowStatus(b.id, 'Completed')
    onNotify('Guest checked out', `${b.guest}'s stay is now Completed`)
  }

  return (
    <section data-testid="bookings-panel">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Bookings</h2>
        <p className="mt-1 text-sm text-slate-500">Reservation ledger across all room types</p>
      </div>

      <div className="rounded-2xl border border-line bg-white shadow-card">
        {/* Search & filter bar */}
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by guest name…"
              className="w-full rounded-xl border border-line bg-canvas py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-slate-400 focus-ring"
              data-testid="bookings-search-input"
            />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'All' | BookingStatus)}
              className="w-full appearance-none rounded-xl border border-line bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-ink focus-ring sm:w-48"
              data-testid="bookings-status-filter"
            >
              <option value="All">All statuses</option>
              {BOOKING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Column header — desktop */}
        <div className="hidden grid-cols-[1.5fr_1.4fr_1.6fr_1fr_auto] gap-4 border-b border-line px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 lg:grid">
          <span>Guest</span>
          <span>Room Type</span>
          <span>Check-in / Check-out</span>
          <span>Status</span>
          <span className="text-right">Action</span>
        </div>

        <div className="divide-y divide-line">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-slate-50/60 sm:px-6 lg:grid-cols-[1.5fr_1.4fr_1.6fr_1fr_auto] lg:items-center lg:gap-4"
              data-testid={`booking-row-${b.id}`}
            >
              {/* Guest */}
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-brand-600/10 text-xs font-bold text-brand-700">
                  {b.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{b.guest}</p>
                  <p className="text-xs text-slate-500">#{b.id.replace('bk-', '')}</p>
                </div>
              </div>

              {/* Room type */}
              <div className="text-sm text-slate-700">
                <span className="lg:hidden text-xs font-semibold uppercase tracking-wide text-slate-400">Room · </span>
                {b.roomType}
              </div>

              {/* Dates */}
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <CalendarRange className="h-4 w-4 flex-none text-slate-400" />
                <span>
                  {b.checkIn} <span className="text-slate-400">→</span> {b.checkOut}
                  <span className="ml-1 text-xs text-slate-400">({b.nights}n)</span>
                </span>
              </div>

              {/* Status */}
              <div>
                <StatusBadge status={b.status} id={b.id} />
              </div>

              {/* Action */}
              <div className="lg:text-right">
                {b.status === 'Confirmed' && (
                  <button
                    onClick={() => handleCheckIn(b)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.98] lg:w-auto"
                    data-testid={`booking-checkin-button-${b.id}`}
                  >
                    <LogIn className="h-4 w-4" /> Check In
                  </button>
                )}
                {b.status === 'Checked-In' && (
                  <button
                    onClick={() => handleCheckOut(b)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand-600 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all duration-200 hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-600/20 active:scale-[0.98] lg:w-auto"
                    data-testid={`booking-checkout-button-${b.id}`}
                  >
                    <LogOut className="h-4 w-4" /> Check Out
                  </button>
                )}
                {b.status !== 'Confirmed' && b.status !== 'Checked-In' && (
                  <span className="hidden text-sm text-slate-300 lg:inline">—</span>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="grid place-items-center py-16 text-center" data-testid="bookings-empty">
              <Inbox className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-ink">No bookings match your filters</p>
              <p className="text-xs text-slate-500">Try a different name or status.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

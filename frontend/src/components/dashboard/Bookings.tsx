import { useMemo, useState } from 'react'
import { Search, ChevronDown, LogIn, LogOut, CalendarRange, Inbox, MessageSquareText } from 'lucide-react'
import { cn } from '../../lib/ui'
import { BOOKINGS, BOOKING_STATUSES } from '../../data/mockData'
import type { Booking, BookingStatus } from '../../types'
import BookingTimeline from './BookingTimeline'

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
 * Bookings — the reservation ledger + visual timeline.
 *
 * State flow:
 *  • `rows` holds every booking; `query` + `status` derive the filtered list.
 *  • Inline actions transition a single row: Confirmed → Checked-In → Completed.
 *  • `openRequest` tracks which guest's special-request popover is open
 *    (click the message badge to toggle; click again / elsewhere to close).
 *  • BookingTimeline (static) renders the weekly availability matrix below.
 */
export default function Bookings({ onNotify }: BookingsProps) {
  const [rows, setRows] = useState<Booking[]>(BOOKINGS)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | BookingStatus>('All')
  const [openRequest, setOpenRequest] = useState<string | null>(null)

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
              {/* Guest + special request badge */}
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-brand-600/10 text-xs font-bold text-brand-700">
                  {b.initials}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-ink">{b.guest}</p>
                    <div className="relative flex-none">
                      <button
                        type="button"
                        title={b.specialRequest}
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenRequest((cur) => (cur === b.id ? null : b.id))
                        }}
                        className={cn(
                          'grid h-6 w-6 place-items-center rounded-full transition-colors',
                          openRequest === b.id ? 'bg-brand-600 text-white' : 'bg-brand-600/10 text-brand-600 hover:bg-brand-600/20',
                        )}
                        data-testid={`special-request-badge-${b.id}`}
                        aria-label="View special request"
                      >
                        <MessageSquareText className="h-3.5 w-3.5" />
                      </button>

                      {openRequest === b.id && (
                        <>
                          {/* click-away layer */}
                          <div className="fixed inset-0 z-20" onClick={() => setOpenRequest(null)} />
                          <div
                            className="absolute left-0 top-full z-30 mt-2 w-64 animate-fade-in rounded-xl border border-line bg-white p-3.5 shadow-card-lg"
                            data-testid={`special-request-popover-${b.id}`}
                          >
                            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600">Special request</p>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600">{b.specialRequest}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">#{b.id.replace('bk-', '')}</p>
                </div>
              </div>

              {/* Room type */}
              <div className="text-sm text-slate-700">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">Room · </span>
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

      {/* Visual weekly availability timeline */}
      <BookingTimeline />
    </section>
  )
}

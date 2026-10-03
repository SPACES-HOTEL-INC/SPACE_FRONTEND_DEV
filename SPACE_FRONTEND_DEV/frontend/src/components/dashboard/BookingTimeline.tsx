import { cn } from '../../lib/ui'
import { TIMELINE_DAYS } from '../../data/mockData'
import { useEffect, useMemo, useState } from 'react'
import { fetchWeeklyAvailability } from '../../lib/api'

// NOTE: We derive a simple timeline from bookings data when possible. The
// structure used here matches the mock `BOOKING_TIMELINE` layout so tests and
// UI selectors remain stable.

// Deep-teal tonal blocks so booking durations read as one visual family.
const TONE: Record<string, string> = {
  primary: 'bg-brand-600 text-white',
  secondary: 'bg-brand-500 text-white',
  tertiary: 'bg-brand-700 text-white',
}

// Shared grid template: a room-label column + 7 equal day columns.
const GRID = 'grid grid-cols-[160px_repeat(7,minmax(72px,1fr))]'

/**
 * BookingTimeline — a horizontal weekly availability matrix.
 * Rows are rooms, columns are Mon–Sun. Each booking renders as a rounded teal
 * block placed via CSS `grid-column: start / span n` (all on grid-row 1, layered
 * over light background day cells). Static mock data from BOOKING_TIMELINE.
 */
export default function BookingTimeline() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchWeeklyAvailability()
      .then((data) => {
        if (!mounted) return
        // If data already looks like timeline rows, use it. Otherwise try to
        // group bookings by room and produce blocks for the current week.
        if (!data) return setRows([])

        if (Array.isArray(data) && data.length > 0 && data[0].blocks) {
          setRows(data)
          return
        }

        // Derive timeline rows from bookings list fallback
        if (Array.isArray(data)) {
          const byRoom: Record<string, any[]> = {}
          data.forEach((b: any, i: number) => {
            const room = b.room_title || b.roomType || `Room ${b.room_id || i}`
            if (!byRoom[room]) byRoom[room] = []
            // crude placement: place each booking into a single-day span using check_in_date
            const start = 1 // fallback place near week start
            const span = Math.max(1, b.num_nights || b.nights || 1)
            byRoom[room].push({ id: b.id || `blk-${i}`, label: b.guest_name || b.guest || b.label || 'Guest', start, span, tone: 'primary' })
          })

          const derived = Object.entries(byRoom).map(([room, blocks], idx) => ({ id: `derived-${idx}`, room, blocks }))
          setRows(derived)
          return
        }

        setRows([])
      })
      .catch(() => {
        if (!mounted) return
        setRows([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const displayRows = useMemo(() => rows || [], [rows])
  return (
    <section className="mt-6 rounded-2xl border border-line bg-white shadow-card" data-testid="booking-timeline">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h3 className="text-base font-extrabold tracking-tight text-ink sm:text-lg">Weekly Availability</h3>
        <p className="text-xs text-slate-500">Booked durations across your rooms this week</p>
      </div>

      <div className="overflow-x-auto p-4 sm:p-5">
        <div className="min-w-[720px]">
          {/* Day headers */}
          <div className={GRID}>
            <div />
            {TIMELINE_DAYS.map((d) => (
              <div key={d} className="px-1 pb-2 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
                {d}
              </div>
            ))}
          </div>

          {/* Room rows */}
          <div className="space-y-1.5">
            {displayRows.map((row: any) => (
              <div key={row.id} className={`${GRID} items-center`} data-testid={`timeline-row-${row.id}`}>
                <div className="truncate pr-3 text-sm font-semibold text-ink">{row.room}</div>

                {/* Background day cells */}
                {TIMELINE_DAYS.map((_, i) => (
                  <div
                    key={i}
                    style={{ gridColumn: i + 2, gridRow: 1 }}
                    className="mx-0.5 h-10 rounded-md bg-slate-50"
                  />
                ))}

                {/* Booking blocks layered on top */}
                {row.blocks?.map((b: any) => (
                  <div
                    key={b.id}
                    style={{ gridColumn: `${b.start + 1} / span ${b.span}`, gridRow: 1 }}
                    className={cn(
                      'z-10 mx-0.5 flex h-10 items-center justify-center rounded-md px-2 text-xs font-semibold shadow-sm transition-transform duration-200 hover:scale-[1.02]',
                      TONE[b.tone],
                    )}
                    data-testid={`timeline-block-${b.id}`}
                  >
                    <span className="truncate">{b.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import { cn } from '../../lib/ui'
import { BOOKING_TIMELINE, TIMELINE_DAYS } from '../../data/mockData'

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
            {BOOKING_TIMELINE.map((row) => (
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
                {row.blocks.map((b) => (
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

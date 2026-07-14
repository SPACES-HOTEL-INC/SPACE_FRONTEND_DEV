import StatsRow from './StatsRow'
import CheckInsQueue from './CheckInsQueue'
import type { Session } from '../../types'

interface OverviewViewProps {
  session: Session
  onNotify: (title: string, message: string) => void
}

// Overview tab: date header, KPI stats row and today's check-ins queue.
export default function OverviewView({ session, onNotify }: OverviewViewProps) {
  return (
    <section data-testid="overview-panel">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            Here's how {session.hotelName} is performing today.
          </p>
        </div>
        <span className="rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-semibold text-slate-600">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <StatsRow />
      {/* CheckInsQueue reports a checked-in guest up to the toast handler */}
      <CheckInsQueue onCheckIn={(guest) => onNotify('Check-in complete', `${guest} checked in successfully`)} />
    </section>
  )
}

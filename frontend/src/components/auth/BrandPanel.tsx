import { ShieldCheck, TrendingUp, CalendarCheck, Wallet } from 'lucide-react'
import Brand from '../ui/Brand'

const HIGHLIGHTS = [
  { icon: TrendingUp, text: 'Real-time occupancy & revenue intelligence' },
  { icon: CalendarCheck, text: 'Unified bookings, arrivals & check-ins' },
  { icon: Wallet, text: 'Instant payouts with automatic reconciliation' },
]

/**
 * The dark, executive brand panel shown on the left half of the auth screens.
 * Hidden below `lg` so mobile users get a focused, single-column form.
 */
export default function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      {/* Layered background: solid ink + teal glow + dotted grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative">
        <Brand variant="light" />
      </div>

      <div className="relative max-w-md">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-200 backdrop-blur">
          <ShieldCheck className="h-3.5 w-3.5" /> Business Console
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white xl:text-5xl">
          Run your property like a Fortune&nbsp;500.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
          One command center for occupancy, revenue, guests and payouts — engineered for
          hoteliers who expect enterprise-grade control.
        </p>

        <ul className="mt-9 space-y-4">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3.5 text-slate-200">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-white/8 ring-1 ring-white/10">
                <Icon className="h-[18px] w-[18px] text-brand-300" />
              </span>
              <span className="text-sm font-medium">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
          $1.2M
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Processed this quarter</p>
          <p className="text-xs text-slate-400">Across 4,800+ reservations · 99.98% uptime</p>
        </div>
      </div>
    </aside>
  )
}

import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '../../lib/ui'
import type { KpiStat } from '../../types'

interface StatCardProps {
  stat: KpiStat
  index: number
}

/**
 * A single KPI card. The `success` tone gives the Daily Revenue card a distinct
 * emerald treatment so it reads as a positive/highlighted metric.
 */
export default function StatCard({ stat, index }: StatCardProps) {
  const { label, value, delta, trend, icon: Icon, tone } = stat
  const success = tone === 'success'

  return (
    <div
      className={cn(
        'animate-rise rounded-2xl border p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg sm:p-6',
        success ? 'border-emerald-200 bg-emerald-50/60' : 'border-line bg-white',
      )}
      style={{ animationDelay: `${index * 80}ms` }}
      data-testid={`stat-card-${stat.id}`}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'grid h-11 w-11 place-items-center rounded-xl',
            success ? 'bg-emerald-600 text-white' : 'bg-brand-600/10 text-brand-600',
          )}
        >
          <Icon className="h-[22px] w-[22px]" />
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold',
            trend === 'up'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-600',
          )}
        >
          {trend === 'up' ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {delta}
        </span>
      </div>

      <p className="mt-5 text-3xl font-extrabold tracking-tight text-ink" data-testid={`stat-value-${stat.id}`}>
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  )
}

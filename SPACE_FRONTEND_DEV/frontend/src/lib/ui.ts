// Shared control styling so inputs/selects stay consistent across the auth forms.
// src/lib/ui.ts
export const inputClass =
  'h-11 w-full rounded-xl border border-line bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 transition-all'

export const selectClass =
  'h-11 rounded-xl border border-line bg-white px-2.5 py-2 text-sm font-medium text-ink focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 transition-all'

export const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700'

// Small className joiner (keeps conditional classes readable).
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

// USD money formatter: no decimals for whole numbers, 2 decimals otherwise.
export function money(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

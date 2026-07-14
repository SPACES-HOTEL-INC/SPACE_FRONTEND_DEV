// Shared control styling so inputs/selects stay consistent across the auth forms.
export const inputClass =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-slate-400 focus-ring'

export const selectClass =
  'w-full appearance-none rounded-xl border border-line bg-white px-4 py-3 pr-11 text-[15px] text-ink focus-ring cursor-pointer'

export const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700'

// Small className joiner (keeps conditional classes readable).
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

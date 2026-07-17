import { cn } from '../../lib/ui'

interface BrandProps {
  variant?: 'light' | 'dark'
  className?: string
}

// The Spaces Hm wordmark + geometric mark. `light` for dark backgrounds,
// `dark` for the off-white surfaces.
export default function Brand({ variant = 'dark', className }: BrandProps) {
  const light = variant === 'light'
  return (
    <div className={cn('flex items-center gap-2.5', className)} data-testid="brand-logo">
      <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-600 shadow-[0_8px_20px_-6px_rgba(15,118,110,0.6)]">
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-300" />
        <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
          <path
            d="M9 23c0-4.5 3.5-6.5 7-6.5s7-2 7-6.5"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span
        className={cn(
          'text-lg font-extrabold tracking-tight',
          light ? 'text-white' : 'text-ink',
        )}
      >
        Spaces<span className="text-brand-500"> Hm</span>
      </span>
    </div>
  )
}

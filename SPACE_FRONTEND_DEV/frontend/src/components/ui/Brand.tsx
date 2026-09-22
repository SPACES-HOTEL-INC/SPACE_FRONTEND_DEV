import { cn } from '../../lib/ui'

interface BrandProps {
  variant?: 'light' | 'dark'
  className?: string
}

/**
 * The Spaces Hm wordmark + custom SVG icon mark.
 * `light` for dark backgrounds (auth panel), `dark` for off-white surfaces (dashboard sidebar).
 */
export default function Brand({ variant = 'dark', className }: BrandProps) {
  const light = variant === 'light'

  return (
    <div className={cn('flex items-center gap-2.5', className)} data-testid="brand-logo">
      {/* Custom Vector Arch Logo */}
      <div className="h-9 w-9 flex-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-full w-full"
        >
          {/* Background Squircle */}
          <rect width="512" height="512" rx="112" fill="#0A0F1D" />

          {/* Main White Arch Form */}
          <path
            fill="#FFFFFF"
            fillRule="evenodd"
            d="M 136 368 
               L 136 248 
               C 136 181.7 189.7 128 256 128 
               C 322.3 128 376 181.7 376 248 
               L 376 368 
               L 304 368 
               L 304 248 
               C 304 221.5 282.5 200 256 200 
               C 229.5 200 208 221.5 208 248 
               L 208 368 
               Z
               M 256 100 
               A 32 32 0 0 1 256 164 
               A 32 32 0 0 1 256 100 
               Z"
          />

          {/* Teal Top Dot */}
          <circle cx="256" cy="132" r="30" fill="#60C3AD" />
        </svg>
      </div>

      {/* Brand Text */}
      <span
        className={cn(
          'text-lg font-extrabold tracking-tight',
          light ? 'text-white' : 'text-ink'
        )}
      >
        Spaces<span className="text-brand-500"> Hm</span>
      </span>
    </div>
  )
}
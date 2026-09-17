import type { ReactNode } from 'react'
import BrandPanel from './BrandPanel'
import Brand from '../ui/Brand'

interface AuthLayoutProps {
  children: ReactNode
}

/**
 * Split-screen shell reused by both Login and Register.
 * Left: dark executive brand panel (lg+). Right: scrollable, centered form area.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-canvas lg:grid lg:grid-cols-[1.05fr_1fr]">
      <BrandPanel />

      <div className="flex min-h-screen flex-col">
        {/* Compact logo shown only on mobile, since the brand panel is hidden */}
        <div className="px-5 pt-6 sm:px-8 lg:hidden">
          <Brand />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-12">
          {children}
        </div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import BrandPanel from './BrandPanel'
import Brand from '../ui/Brand'

interface AuthLayoutProps {
  children: ReactNode
}

/**
 * Split-screen shell reused by both Login and Register.
 * Left: dark executive brand panel (lg+). Right: non-scrollable, centered form area on mobile.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden bg-canvas lg:grid lg:grid-cols-[1.05fr_1fr]">
      <BrandPanel />

      <div className="flex h-full w-full flex-col overflow-hidden">
        {/* Compact logo shown only on mobile */}
        <div className="px-5 pt-4 shrink-0 sm:px-8 lg:hidden">
          <Brand />
        </div>

        <main role="main" className="flex flex-1 items-center justify-center overflow-hidden px-5 py-4 sm:px-8 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
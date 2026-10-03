import type { ReactNode } from 'react'
import BrandPanel from './BrandPanel'
import Brand from '../ui/Brand'

interface AuthLayoutProps {
  children: ReactNode
}

/**
 * Split-screen shell reused by both Login and Register.
 * Left: dark executive brand panel (lg+). Right: scrollable form container.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen h-screen w-full overflow-y-auto bg-canvas lg:grid lg:grid-cols-[1.05fr_1fr]">
      <BrandPanel />

      <div className="flex min-h-full w-full flex-col justify-between">
        {/* Compact logo shown only on mobile */}
        <div className="px-5 pt-6 shrink-0 sm:px-8 lg:hidden">
          <Brand />
        </div>

        <main role="main" className="flex w-full flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
          {children}
        </main>
      </div>
    </div>
  )
}
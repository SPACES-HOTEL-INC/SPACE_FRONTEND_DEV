import { Menu, Bell, Search } from 'lucide-react'
import type { Session } from '../../types'

interface MiniHeaderProps {
  session: Session
  onOpenMenu: () => void
}

/**
 * Sticky mini-header. Shows the logged-in hotel identity (name + merchant ID),
 * a live "Online" status pill, quick search, notifications and the account
 * avatar. The hamburger (mobile only) opens the sidebar drawer.
 */
export default function MiniHeader({ session, onOpenMenu }: MiniHeaderProps) {
  const avatarInitials = session.hotelName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/80 backdrop-blur-lg">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onOpenMenu}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink lg:hidden"
          aria-label="Open menu"
          data-testid="open-menu-button"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Hotel identity */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h1
              className="truncate text-base font-extrabold tracking-tight text-ink sm:text-lg"
              data-testid="header-hotel-name"
            >
              {session.hotelName}
            </h1>
            <span
              className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 sm:inline-flex"
              data-testid="online-status-indicator"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Online
            </span>
          </div>
          <p className="truncate text-xs text-slate-500" data-testid="header-merchant-id">
            Merchant ID · {session.merchantId}
          </p>
        </div>

        {/* Search (desktop) */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search bookings, rooms, guests…"
            className="w-64 rounded-xl border border-line bg-canvas py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-slate-400 focus-ring"
            data-testid="header-search-input"
          />
        </div>

        <button
          className="relative rounded-xl border border-line bg-white p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-ink"
          aria-label="Notifications"
          data-testid="notifications-button"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>

        <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-ink text-sm font-bold text-white">
          {avatarInitials}
        </div>
      </div>
    </header>
  )
}

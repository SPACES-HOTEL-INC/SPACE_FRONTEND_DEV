import { X, LogOut, Settings, LifeBuoy } from 'lucide-react'
import Brand from '../ui/Brand'
import { cn } from '../../lib/ui'
import { NAV_ITEMS } from '../../data/mockData'

interface SidebarProps {
  active: string
  onSelect: (id: string) => void
  mobileOpen: boolean
  onClose: () => void
  onSignOut: () => void
}

// Inner content shared by the desktop rail and the mobile slide-over.
function SidebarContent({
  active,
  onSelect,
  onSignOut,
}: Pick<SidebarProps, 'active' | 'onSelect' | 'onSignOut'>) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Brand />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" data-testid="sidebar-nav">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Console
        </p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-brand-600 text-white shadow-[0_10px_20px_-10px_rgba(15,118,110,0.8)]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
              )}
              data-testid={`nav-item-${id}`}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-colors',
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-600',
                )}
              />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-line px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink">
          <Settings className="h-5 w-5 text-slate-400" /> Settings
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink">
          <LifeBuoy className="h-5 w-5 text-slate-400" /> Support
        </button>
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          data-testid="sign-out-button"
        >
          <LogOut className="h-5 w-5" /> Sign out
        </button>
      </div>
    </div>
  )
}

/**
 * Left navigation. Two presentations from one component:
 *  • lg+  → a fixed rail always visible.
 *  • <lg  → a slide-over drawer driven by `mobileOpen` (toggled from the header).
 */
export default function Sidebar({
  active,
  onSelect,
  mobileOpen,
  onClose,
  onSignOut,
}: SidebarProps) {
  const handleSelect = (id: string) => {
    onSelect(id)
    onClose() // auto-close the drawer after picking a section on mobile
  }

  return (
    <>
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] border-r border-line bg-white lg:block">
        <SidebarContent active={active} onSelect={onSelect} onSignOut={onSignOut} />
      </aside>

      {/* Mobile slide-over */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            'absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={onClose}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-[280px] max-w-[82%] bg-white shadow-card-lg transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          data-testid="mobile-sidebar"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink"
            aria-label="Close menu"
            data-testid="close-sidebar-button"
          >
            <X className="h-5 w-5" />
          </button>
          <SidebarContent active={active} onSelect={handleSelect} onSignOut={onSignOut} />
        </div>
      </div>
    </>
  )
}

import { X } from 'lucide-react'
import { cn } from '../../lib/ui'
import { AMENITY_CATEGORIES } from '../../data/mockData'
import type { RoomType } from '../../types'

interface FacilitiesModalProps {
  room: RoomType | null // when non-null the modal is open for this room
  onClose: () => void
}

/**
 * FacilitiesModal — overlay that lists a room's selected facilities grouped by
 * category. Opened from the "Show all facilities and services" link on a card.
 * Only categories that have at least one selected item are shown.
 */
export default function FacilitiesModal({ room, onClose }: FacilitiesModalProps) {
  const open = !!room

  return (
    <div className={cn('fixed inset-0 z-[70]', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}>
      <div
        className={cn('absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-end justify-center sm:items-center sm:p-6">
        <div
          className={cn(
            'flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-card-lg transition-all duration-300 sm:rounded-2xl',
            open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          )}
          data-testid="facilities-modal"
        >
          {room && (
            <>
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-ink">Facilities &amp; services</h3>
                  <p className="text-xs text-slate-500">{room.title}</p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  data-testid="facilities-modal-close"
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                {AMENITY_CATEGORIES.map((cat) => {
                  const items = cat.items.filter((it) => room.amenities.includes(it.id))
                  if (items.length === 0) return null
                  const CatIcon = cat.icon
                  return (
                    <div key={cat.id} data-testid={`facilities-category-${cat.id}`}>
                      <div className="mb-3 flex items-center gap-2.5">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600/10 text-brand-600">
                          <CatIcon className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-bold text-ink">{cat.label}</p>
                      </div>
                      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {items.map((it) => {
                          const ItemIcon = it.icon
                          return (
                            <li
                              key={it.id}
                              data-testid={`facility-item-${it.id}`}
                              className="flex items-center gap-2.5 text-sm text-slate-600"
                            >
                              <ItemIcon className="h-4 w-4 flex-none text-slate-400" />
                              {it.label}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

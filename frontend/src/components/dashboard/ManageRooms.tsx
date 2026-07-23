import { useState } from 'react'
import { Plus, Users, Layers, BedDouble, ChevronRight } from 'lucide-react'
import { AMENITY_MAP, ROOM_TYPES } from '../../data/mockData'
import type { RoomType } from '../../types'
import RoomFormPanel from './RoomFormPanel'
import RoomImageCarousel from './RoomImageCarousel'
import FacilitiesModal from './FacilitiesModal'

interface ManageRoomsProps {
  onNotify: (title: string, message: string) => void
}

const MAX_CARD_ICONS = 5

/**
 * ManageRooms — card grid of room types + the "Add New Room Type" slide-over.
 *
 * State flow:
 *  • `rooms`         → local list seeded from ROOM_TYPES; onSave prepends new rooms.
 *  • `panelOpen`     → toggles the RoomFormPanel slide-over.
 *  • `facilitiesRoom`→ the room whose full categorised facilities modal is open
 *                      (null = closed), driven by the card's "Show all …" link.
 */
export default function ManageRooms({ onNotify }: ManageRoomsProps) {
  const [rooms, setRooms] = useState<RoomType[]>(ROOM_TYPES)
  const [panelOpen, setPanelOpen] = useState(false)
  const [facilitiesRoom, setFacilitiesRoom] = useState<RoomType | null>(null)

  const handleSave = (room: RoomType) => {
    setRooms((prev) => [room, ...prev])
    onNotify('Room published', `${room.title} is now live in your inventory`)
  }

  return (
    <section data-testid="manage-rooms-panel">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">s</h2>
          <p className="mt-1 text-sm text-slate-500">
            {rooms.length} active room type{rooms.length === 1 ? '' : 's'} in your inventory
          </p>
        </div>
        <button
          onClick={() => setPanelOpen(true)}
          className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.99]"
          data-testid="add-room-button"
        >
          <Plus className="h-[18px] w-[18px] transition-transform duration-200 group-hover:rotate-90" />
          Add New Room Type
        </button>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" data-testid="rooms-grid">
        {rooms.map((room) => (
          <article
            key={room.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg"
            data-testid={`room-card-${room.id}`}
          >
            {/* Image carousel + overlays */}
            <div className="relative">
              <RoomImageCarousel images={room.images} title={room.title} testId={`room-${room.id}`} />
              <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
              </span>
              <span
                className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg bg-ink/80 px-2.5 py-1 text-sm font-bold text-white backdrop-blur"
                data-testid={`room-price-${room.id}`}
              >
                {room.currency}
                {room.price.toLocaleString()}
                <span className="text-xs font-medium text-slate-300"> /night</span>
              </span>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="truncate text-base font-extrabold tracking-tight text-ink">{room.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{room.description}</p>

              <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-slate-400" /> {room.inventory} units
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" /> Up to {room.capacity}
                </span>
              </div>

              {/* Facilities summary + link to full list */}
              <div className="mt-4 border-t border-line pt-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {room.amenities.slice(0, MAX_CARD_ICONS).map((id) => {
                    const a = AMENITY_MAP[id]
                    if (!a) return null
                    const Icon = a.icon
                    return (
                      <span
                        key={id}
                        title={a.label}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500"
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                    )
                  })}
                  {room.amenities.length > MAX_CARD_ICONS && (
                    <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-slate-100 px-2 text-xs font-bold text-slate-500">
                      +{room.amenities.length - MAX_CARD_ICONS}
                    </span>
                  )}
                </div>

                {room.amenities.length > 0 && (
                  <button
                    onClick={() => setFacilitiesRoom(room)}
                    className="group/link mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
                    data-testid={`show-all-facilities-${room.id}`}
                  >
                    Show all facilities and services
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}

        {rooms.length === 0 && (
          <div className="col-span-full grid place-items-center rounded-2xl border border-dashed border-line bg-white py-16 text-center">
            <BedDouble className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-ink">No room types yet</p>
            <p className="text-xs text-slate-500">Click "Add New Room Type" to publish your first listing.</p>
          </div>
        )}
      </div>

      <RoomFormPanel open={panelOpen} onClose={() => setPanelOpen(false)} onSave={handleSave} />
      <FacilitiesModal room={facilitiesRoom} onClose={() => setFacilitiesRoom(null)} />
    </section>
  )
}

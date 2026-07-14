import { useState } from 'react'
import { Plus, Users, Layers, BedDouble } from 'lucide-react'
import { cn } from '../../lib/ui'
import { AMENITIES, ROOM_TYPES } from '../../data/mockData'
import type { RoomType } from '../../types'
import RoomFormPanel from './RoomFormPanel'

interface ManageRoomsProps {
  onNotify: (title: string, message: string) => void
}

// Quick lookup so cards can render amenity icons from their id list.
const AMENITY_MAP = Object.fromEntries(AMENITIES.map((a) => [a.id, a]))

/**
 * ManageRooms — card grid of room types + the "Add New Room Type" slide-over.
 *
 * State flow: `rooms` is local state seeded from ROOM_TYPES. Opening the panel
 * (`panelOpen`) shows RoomFormPanel; its onSave prepends the new room to the
 * grid and fires a toast via onNotify.
 */
export default function ManageRooms({ onNotify }: ManageRoomsProps) {
  const [rooms, setRooms] = useState<RoomType[]>(ROOM_TYPES)
  const [panelOpen, setPanelOpen] = useState(false)

  const handleSave = (room: RoomType) => {
    setRooms((prev) => [room, ...prev])
    onNotify('Room published', `${room.title} is now live in your inventory`)
  }

  return (
    <section data-testid="manage-rooms-panel">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Manage Rooms</h2>
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
            className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg"
            data-testid={`room-card-${room.id}`}
          >
            {/* Cover */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={room.images[0]}
                alt={room.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
              </span>
              <span className="absolute bottom-3 right-3 rounded-lg bg-ink/80 px-2.5 py-1 text-sm font-bold text-white backdrop-blur">
                {room.currency}
                {room.price.toLocaleString()}
                <span className="text-xs font-medium text-slate-300"> /night</span>
              </span>
            </div>

            {/* Body */}
            <div className="p-5">
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

              {/* Amenity icons */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-4">
                {room.amenities.map((id) => {
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
    </section>
  )
}

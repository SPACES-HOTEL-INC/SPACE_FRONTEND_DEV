import { useState } from 'react'
import { Plus, Users, Layers, BedDouble, ChevronRight, Building2, MapPin, Star, Edit3 } from 'lucide-react'
import { AMENITY_MAP, ROOM_TYPES } from '../../data/mockData'
import type { RoomType } from '../../types'
import RoomFormPanel from './RoomFormPanel'
import RoomImageCarousel from './RoomImageCarousel'
import FacilitiesModal from './FacilitiesModal'
import PropertyFormModal from './PropertyFormModal'
import CustomSelect from '../ui/CustomSelect'

interface Property {
  id: string
  name: string
  propertyType: string
  starRating: number
  address: string
}

interface ManageRoomsProps {
  onNotify: (title: string, message: string) => void
}

const MAX_CARD_ICONS = 5

export default function ManageRooms({ onNotify }: ManageRoomsProps) {
  // Properties Ecosystem State
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 'prop-1',
      name: 'Regent 1',
      propertyType: 'Hotel',
      starRating: 5,
      address: '12 Victoria Island, Lagos',
    },
  ])
  const [activePropertyId, setActivePropertyId] = useState<string>('prop-1')
  const [propertyModalOpen, setPropertyModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  // Rooms State
  const [rooms, setRooms] = useState<(RoomType & { propertyId?: string })[]>(() =>
    ROOM_TYPES.map((r) => ({ ...r, propertyId: 'prop-1' }))
  )
  const [panelOpen, setPanelOpen] = useState(false)
  const [facilitiesRoom, setFacilitiesRoom] = useState<RoomType | null>(null)

  const activeProperty = properties.find((p) => p.id === activePropertyId) || properties[0]
  const activeRooms = rooms.filter((r) => r.propertyId === activePropertyId)

  // Handle Upsert (Create or Edit)
  const handleSaveProperty = (savedProperty: Property) => {
    const exists = properties.some(p => p.id === savedProperty.id)
    if (exists) {
      setProperties((prev) => prev.map(p => p.id === savedProperty.id ? savedProperty : p))
      onNotify('Property Updated', `${savedProperty.name} profile modifications saved.`)
    } else {
      setProperties((prev) => [savedProperty, ...prev])
      setActivePropertyId(savedProperty.id)
      onNotify('Property Created', `${savedProperty.name} ecosystem added successfully.`)
    }
    setEditingProperty(null)
  }

  const handleSaveRoom = (room: RoomType) => {
    const roomWithProperty = { ...room, propertyId: activePropertyId }
    setRooms((prev) => [roomWithProperty, ...prev])
    onNotify('Room published', `${room.title} is now live in ${activeProperty?.name}`)
  }

  // Transform properties into the option array format required by CustomSelect
  const propertyOptions = properties.map((p) => ({
    label: `${p.name} (${String(p.propertyType).toUpperCase()})`,
    value: p.id,
  }))

  return (
    <section data-testid="manage-rooms-panel">
      {/* Selector Header Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Property Branch:</span>
          <div className="flex items-center gap-2">
            {/* Custom Styled Dropdown UI replaces native box menu */}
            <CustomSelect
              options={propertyOptions}
              value={activePropertyId}
              onChange={(val) => setActivePropertyId(val)}
              className="w-64"
            />

            <button
              onClick={() => {
                setEditingProperty(activeProperty)
                setPropertyModalOpen(true)
              }}
              title="Edit this branch profile info"
              className="inline-flex h-14 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 shrink-0"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingProperty(null)
            setPropertyModalOpen(true)
          }}
          className="inline-flex h-14 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800"
        >
          <Building2 className="h-4 w-4" />
          Create New Property
        </button>
      </div>

      {/* Grid Content Layout Headers */}
      {activeProperty && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                {activeProperty.name}
              </h2>
              <div className="flex items-center text-amber-400">
                {Array.from({ length: activeProperty.starRating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
              <MapPin className="h-4 w-4 text-slate-300" /> {activeProperty.address}
            </p>
          </div>

          <button
            onClick={() => setPanelOpen(true)}
            className="group inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 transition-all active:scale-[0.99]"
          >
            <Plus className="h-[18px] w-[18px] transition-transform duration-200 group-hover:rotate-90" />
            Add New Room Type
          </button>
        </div>
      )}

      {/* Grid rendering remains completely intact */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {activeRooms.map((room) => (
          <article key={room.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
            <div className="relative">
              <RoomImageCarousel images={room.images} title={room.title} />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
              </span>
              <span className="absolute right-3 top-3 rounded-lg bg-slate-900/80 px-2.5 py-1 text-sm font-bold text-white backdrop-blur">
                {room.currency}{room.price.toLocaleString()}<span className="text-xs font-medium text-slate-300"> /night</span>
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="truncate text-base font-bold text-slate-900">{room.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-400">{room.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5"><Layers className="h-4 w-4" /> {room.inventory} units</span>
                <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> Up to {room.capacity}</span>
              </div>
              {room.amenities.length > 0 && (
                <button onClick={() => setFacilitiesRoom(room)} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
                  Show all facilities
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </article>
        ))}
        {activeRooms.length === 0 && (
          <div className="col-span-full grid place-items-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <BedDouble className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-800">No room types under {activeProperty?.name} yet</p>
          </div>
        )}
      </div>

      <PropertyFormModal
        open={propertyModalOpen}
        onClose={() => {
          setPropertyModalOpen(false)
          setEditingProperty(null)
        }}
        onSave={handleSaveProperty}
        propertyToEdit={editingProperty}
      />

      <RoomFormPanel open={panelOpen} onClose={() => setPanelOpen(false)} onSave={handleSaveRoom} />
      <FacilitiesModal room={facilitiesRoom} onClose={() => setFacilitiesRoom(null)} />
    </section>
  )
}
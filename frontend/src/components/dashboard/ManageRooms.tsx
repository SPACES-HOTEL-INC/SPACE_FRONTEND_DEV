import { useEffect, useState } from 'react'
import { Plus, Users, Layers, BedDouble, ChevronRight, Building2, MapPin, Star, Edit3, Loader2 } from 'lucide-react'
import type { RoomType } from '../../types'
import RoomFormPanel from './RoomFormPanel'
import RoomImageCarousel from './RoomImageCarousel'
import FacilitiesModal from './FacilitiesModal'
import PropertyFormModal from './PropertyFormModal'
import CustomSelect from '../ui/CustomSelect'
import { fetchWithAuth } from '../../lib/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-nq9s.onrender.com'

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
  const [properties, setProperties] = useState<Property[]>([])
  const [activePropertyId, setActivePropertyId] = useState<string>('')
  const [propertyModalOpen, setPropertyModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isLoadingProperties, setIsLoadingProperties] = useState(false)
  const [propertiesError, setPropertiesError] = useState<string | null>(null)

  // Rooms State
  const [rooms, setRooms] = useState<(RoomType & { propertyId?: string })[]>([])
  const [isLoadingRooms, setIsLoadingRooms] = useState(false)
  const [roomsError, setRoomsError] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [facilitiesRoom, setFacilitiesRoom] = useState<RoomType | null>(null)

  const activeProperty = properties.find((p) => p.id === activePropertyId) || properties[0]
  const activeRooms = rooms.filter((r) => r.propertyId === activePropertyId)

  useEffect(() => {
    let isMounted = true

    const loadProperties = async () => {
      setIsLoadingProperties(true)
      setPropertiesError(null)

      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/api/v1/properties/mine`)
        const items = Array.isArray(data) ? data : data.properties || data.items || data.data || []
        const nextProperties: Property[] = items.map((p: any) => ({
          id: String(p.id ?? p._id ?? ''),
          name: p.hotel_name || p.name || p.title || 'Untitled property',
          propertyType: String(p.property_type || 'Hotel'),
          starRating: Number(p.avg_rating || p.star_rating || 5),
          address: p.address || 'No address provided',
        })).filter((p) => p.id)

        if (!isMounted) return
        setProperties(nextProperties)
        if (nextProperties.length > 0 && !activePropertyId) {
          setActivePropertyId(nextProperties[0].id)
        }
      } catch (error: any) {
        if (!isMounted) return
        setPropertiesError(error.message || 'Could not load your properties.')
      } finally {
        if (isMounted) setIsLoadingProperties(false)
      }
    }

    loadProperties()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!activePropertyId) {
      setRooms([])
      return
    }

    let isMounted = true

    const loadRooms = async () => {
      setIsLoadingRooms(true)
      setRoomsError(null)

      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/api/v1/rooms/?property_id=${encodeURIComponent(activePropertyId)}`)
        const nextRooms = Array.isArray(data) ? data : data.rooms || data.items || data.data || []

        if (!isMounted) return
        setRooms(nextRooms.map((room: any, index: number) => ({
          id: String(room.id ?? room._id ?? `room-${index}`),
          title: room.title || room.name || 'Untitled Room',
          description: room.description || 'No description available.',
          price: Number(room.price ?? room.price_per_night ?? 0),
          currency: room.currency || '₦',
          inventory: Number(room.inventory ?? room.total_units ?? 1),
          capacity: Number(room.capacity ?? 2),
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
          images: Array.isArray(room.images) ? room.images.filter(Boolean) : [],
          status: room.is_available === false ? 'maintenance' : 'available',
          propertyId: String(room.property_id ?? activePropertyId),
        })))
      } catch (error: any) {
        if (!isMounted) return
        setRoomsError(error.message || 'Could not load rooms for this property.')
        setRooms([])
      } finally {
        if (isMounted) setIsLoadingRooms(false)
      }
    }

    loadRooms()
    return () => {
      isMounted = false
    }
  }, [activePropertyId])

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
            {isLoadingProperties ? (
              <div className="flex h-14 w-64 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-brand-600" /> Loading properties...
              </div>
            ) : propertyOptions.length > 0 ? (
              <CustomSelect
                options={propertyOptions}
                value={activePropertyId}
                onChange={(val) => setActivePropertyId(val)}
                className="w-64"
              />
            ) : (
              <div className="flex h-14 w-64 items-center rounded-xl border border-amber-200 bg-amber-50 px-3 text-xs text-amber-700">
                No properties available.
              </div>
            )}

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

      {propertiesError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
          {propertiesError}
        </div>
      )}

      {roomsError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
          {roomsError}
        </div>
      )}

      {/* Grid rendering remains completely intact */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {isLoadingRooms ? (
          <div className="col-span-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-sm font-medium text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-brand-600" /> Loading room inventory...
          </div>
        ) : activeRooms.length > 0 ? activeRooms.map((room) => (
          <article key={room.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:-translate-y-0.5 transition-all">
            <div className="relative">
              <RoomImageCarousel images={room.images?.length ? room.images : ['https://images.unsplash.com/...']} title={room.title} testId={room.id} />
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
        )) : (
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
      />

      <RoomFormPanel open={panelOpen} onClose={() => setPanelOpen(false)} onSave={handleSaveRoom} />
      <FacilitiesModal room={facilitiesRoom} onClose={() => setFacilitiesRoom(null)} />
    </section>
  )
}
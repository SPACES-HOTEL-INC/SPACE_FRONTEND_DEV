import { useState, useEffect } from 'react'
import { X, Building2, MapPin, Plus, ArrowLeft } from 'lucide-react'
import { cn } from '../../lib/ui'
import CustomSelect from '../ui/CustomSelect'

interface Property {
  id: string
  name: string
  propertyType: string
  starRating: number
  address: string
}

interface PropertyFormModalProps {
  open: boolean
  onClose: () => void
  onSave: (property: Property) => void
  propertyToEdit?: Property | null
}

const PROPERTY_TYPES = [
  { label: 'Hotel', value: 'Hotel' },
  { label: 'Shortlet Apartment', value: 'Shortlet Apartment' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Resort', value: 'Resort' },
]

const STAR_RATINGS = [
  { label: '1 Star', value: 1 },
  { label: '2 Star', value: 2 },
  { label: '3 Star', value: 3 },
  { label: '4 Star', value: 4 },
  { label: '5 Star', value: 5 },
]

export default function PropertyFormModal({ open, onClose, onSave, propertyToEdit }: PropertyFormModalProps) {
  const [name, setName] = useState('')
  const [propertyType, setPropertyType] = useState('Hotel')
  const [starRating, setStarRating] = useState(5)
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (propertyToEdit) {
      setName(propertyToEdit.name)
      setPropertyType(propertyToEdit.propertyType)
      setStarRating(propertyToEdit.starRating)
      setAddress(propertyToEdit.address)
    } else {
      setName('')
      setPropertyType('Hotel')
      setStarRating(5)
      setAddress('')
    }
  }, [propertyToEdit, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !address.trim()) return

    onSave({
      id: propertyToEdit ? propertyToEdit.id : `prop-${Date.now()}`,
      name: name.trim(),
      propertyType,
      starRating,
      address: address.trim(),
    })
    
    onClose()
  }

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center', open ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div
        className={cn('absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />

      <div
        className={cn(
          'relative z-10 w-full max-w-xl transform rounded-3xl bg-white p-8 shadow-xl transition-all duration-300 border border-slate-100',
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        )}
      >
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{propertyToEdit ? 'Edit Property Profile' : 'Hotel Profile'}</h3>
            <p className="text-sm text-slate-400 mt-1">Provide precise details about your estate location</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-50 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Property Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Official Hotel / Estate Name</label>
            <div className="relative flex items-center">
              <Building2 className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Grand Regent Hotel"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-800 placeholder:text-slate-300 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 transition-all"
              />
            </div>
          </div>

          {/* Custom Styled Dropdowns Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Property Type</label>
              <CustomSelect
                options={PROPERTY_TYPES}
                value={propertyType}
                onChange={(val) => setPropertyType(val)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Star Rating</label>
              <CustomSelect
                options={STAR_RATINGS}
                value={starRating}
                onChange={(val) => setStarRating(Number(val))}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Physical Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400 pointer-events-none" />
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, city, state, postal code"
                className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-4 text-base text-slate-800 placeholder:text-slate-300 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 transition-all resize-none"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 text-base font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              <ArrowLeft className="h-5 w-5" /> Back
            </button>
            
            <button
              type="submit"
              className="inline-flex h-14 flex-1 items-center justify-center rounded-2xl bg-teal-700 px-6 text-base font-bold text-white shadow-sm hover:bg-teal-800 transition-all active:scale-[0.99]"
            >
              {propertyToEdit ? 'Save Changes' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
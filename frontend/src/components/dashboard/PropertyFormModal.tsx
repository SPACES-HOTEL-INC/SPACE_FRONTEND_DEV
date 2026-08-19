import { useEffect, useState, useRef } from 'react'
import { X, UploadCloud, Check, Plus, Loader2, Building2 } from 'lucide-react'
import { cn, labelClass, inputClass } from '../../lib/ui'
import { AMENITY_CATEGORIES } from '../../data/mockData'
import type { Branch } from '../../types'

interface PropertyFormModalProps {
  open: boolean
  onClose: () => void
  onSave: (property: Branch) => void
}

const MIN_IMAGES = 0
const MAX_IMAGES = 5

const PROPERTY_TYPES = [
  { label: 'Hotel', value: 'Hotel' },
  { label: 'Resort', value: 'Resort' },
  { label: 'Apartment / Shortlet', value: 'Apartment' },
  { label: 'Boutique Hotel', value: 'Boutique Hotel' },
  { label: 'Villa', value: 'Villa' },
]

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-nq9s.onrender.com'

export default function PropertyFormModal({ open, onClose, onSave }: PropertyFormModalProps) {
  const [name, setName] = useState('')
  const [propertyType, setPropertyType] = useState('Hotel')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('Nigeria')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])

  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName('')
      setPropertyType('Hotel')
      setAddress('')
      setCity('')
      setState('')
      setCountry('Nigeria')
      setPhone('')
      setEmail('')
      setDescription('')
      setAmenities([])
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
      setFiles([])
      setPreviewUrls([])
      setIsSubmitting(false)
      setErrorMessage(null)
    }
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    if (files.length + newFiles.length > MAX_IMAGES) {
      setErrorMessage(`You can upload a maximum of ${MAX_IMAGES} photos for this property.`)
      return
    }
    setErrorMessage(null)
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    setFiles((prev) => [...prev, ...newFiles])
    setPreviewUrls((prev) => [...prev, ...newPreviews])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index])
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (id: string) =>
    setAmenities((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))

  const canPublish = name.trim().length > 0 && address.trim().length > 0 && !isSubmitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canPublish) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('property_type', propertyType)
      formData.append('address', address.trim())
      formData.append('city', city.trim())
      formData.append('state', state.trim())
      formData.append('country', country.trim())
      formData.append('phone', phone.trim())
      formData.append('email', email.trim())
      formData.append('description', description.trim())
      formData.append('amenities', JSON.stringify(amenities))

      files.forEach((file) => {
        formData.append('images', file)
      })

      const token = localStorage.getItem('token') || localStorage.getItem('access_token')

      const response = await fetch(`${API_BASE_URL}/api/v1/properties`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        const errorDetail = typeof errData.detail === 'string'
          ? errData.detail
          : Array.isArray(errData.detail)
          ? errData.detail.map((e: any) => `${e.loc?.slice(-1)[0] || 'field'}: ${e.msg}`).join(', ')
          : errData.message || 'Failed to create property branch.'
        throw new Error(errorDetail)
      }

      const createdProperty = await response.json()

      const formattedProperty: Branch = {
        id: createdProperty.id || `prop_${Date.now()}`,
        name: createdProperty.name || name,
        propertyType: createdProperty.property_type || propertyType,
        location: createdProperty.city ? `${createdProperty.city}, ${createdProperty.state}` : address,
        status: createdProperty.status || 'active',
        roomTypesCount: createdProperty.room_types_count || 0,
        totalRooms: createdProperty.total_rooms || 0,
        occupiedRooms: 0,
      }

      onSave(formattedProperty)
      onClose()
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while creating the property.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn('fixed inset-0 z-50', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}>
      <div
        className={cn('absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />

      <div
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-[600px] flex-col bg-white shadow-card-lg transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600/10 text-brand-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-ink">Add New Property Branch</h3>
              <p className="text-xs text-slate-500">Register a new hotel or apartment location</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-ink disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form id="property-form" onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Property Name & Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="prop-name" className={labelClass}>
                Property Name *
              </label>
              <input
                id="prop-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grand Regent Hotel - Victoria Island"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="prop-type" className={labelClass}>
                Type
              </label>
              <select
                id="prop-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={`${inputClass} bg-white cursor-pointer`}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label htmlFor="prop-address" className={labelClass}>
              Street Address *
            </label>
            <input
              id="prop-address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 14 Ahmadu Bello Way, VI"
              className={inputClass}
            />
          </div>

          {/* City, State, Country */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="prop-city" className={labelClass}>
                City
              </label>
              <input
                id="prop-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lagos"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="prop-state" className={labelClass}>
                State / Region
              </label>
              <input
                id="prop-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Lagos State"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="prop-country" className={labelClass}>
                Country
              </label>
              <input
                id="prop-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Nigeria"
                className={inputClass}
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="prop-phone" className={labelClass}>
                Contact Phone
              </label>
              <input
                id="prop-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="prop-email" className={labelClass}>
                Contact Email
              </label>
              <input
                id="prop-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="frontdesk.vi@grandregent.com"
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="prop-desc" className={labelClass}>
              Property Description
            </label>
            <textarea
              id="prop-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief summary of the property location, features, and target guests..."
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 resize-none"
            />
          </div>

          {/* Property Amenities */}
          <div>
            <span className={labelClass}>Property Facilities</span>
            <div className="space-y-4">
              {AMENITY_CATEGORIES.map((cat) => {
                const CatIcon = cat.icon
                return (
                  <div key={cat.id}>
                    <div className="mb-2 flex items-center gap-2">
                      <CatIcon className="h-4 w-4 text-brand-600" />
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{cat.label}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {cat.items.map((item) => {
                        const active = amenities.includes(item.id)
                        const ItemIcon = item.icon
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleAmenity(item.id)}
                            className={cn(
                              'flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all',
                              active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-line bg-white text-slate-600 hover:bg-slate-50'
                            )}
                          >
                            <span
                              className={cn(
                                'grid h-4 w-4 place-items-center rounded border',
                                active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
                              )}
                            >
                              {active && <Check className="h-3 w-3" />}
                            </span>
                            <ItemIcon className="h-4 w-4 text-slate-400" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cover Photos */}
          <div>
            <span className={labelClass}>Property Photos (Optional)</span>
            <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleFileChange} className="hidden" />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= MAX_IMAGES || isSubmitting}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-slate-50 px-6 py-6 text-center transition-colors hover:border-brand-600 hover:bg-brand-50/40 disabled:opacity-60"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600/10">
                <UploadCloud className="h-5 w-5 text-brand-600" />
              </span>
              <p className="text-sm font-semibold text-ink">
                {files.length >= MAX_IMAGES ? 'Maximum photos attached' : 'Click to add property photos'}
              </p>
              <p className="text-xs text-slate-500">Up to 5 images (JPEG, PNG)</p>
            </button>

            {previewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {previewUrls.map((src, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-slate-100">
                    <img src={src} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white hover:bg-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-line bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="property-form"
            disabled={!canPublish}
            className="ml-auto flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 disabled:bg-slate-300"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create Property Branch
          </button>
        </div>
      </div>
    </div>
  )
}
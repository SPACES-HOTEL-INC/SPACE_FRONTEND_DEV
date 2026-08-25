import { useEffect, useState, useRef } from 'react'
import { X, UploadCloud, Check, Plus, Loader2, Building2 } from 'lucide-react'
import { cn, labelClass } from '../../lib/ui'
import { AMENITY_CATEGORIES, CURRENCIES, CAPACITY_OPTIONS } from '../../data/mockData'
import type { RoomType } from '../../types'
import CustomSelect from '../ui/CustomSelect'

interface PropertyOption {
  id: string
  title: string
}

interface RoomFormPanelProps {
  open: boolean
  onClose: () => void
  onSave: (room: RoomType) => void
  propertyId?: string
}

const MIN_IMAGES = 3
const MAX_IMAGES = 7

const formatPriceInput = (val: string) => {
  const clean = val.replace(/[^0-9.]/g, '')
  if (!clean) return ''
  const parts = clean.split('.')
  const integerPart = parts[0]
  const decimalPart = parts.length > 1 ? '.' + parts[1].slice(0, 2) : ''
  const formattedInteger = integerPart ? Number(integerPart).toLocaleString('en-US') : '0'
  return `${formattedInteger}${decimalPart}`
}

export default function RoomFormPanel({ open, onClose, onSave, propertyId }: RoomFormPanelProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(propertyId || '')
  const [hostProperties, setHostProperties] = useState<PropertyOption[]>([])
  const [isLoadingProperties, setIsLoadingProperties] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('₦')
  const [inventory, setInventory] = useState('')
  const [capacity, setCapacity] = useState('2')
  const [amenities, setAmenities] = useState<string[]>([])

  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch host properties if propertyId was not passed explicitly
  useEffect(() => {
    if (open) {
      if (propertyId) {
        setSelectedPropertyId(propertyId)
      } else {
        fetchHostProperties()
      }
    }
  }, [open, propertyId])

  const fetchHostProperties = async () => {
    setIsLoadingProperties(true)
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token')
      const res = await fetch('/api/v1/properties/mine', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.detail || `Failed to fetch properties (Status ${res.status})`)
      }

      const data = await res.json()

      // Robustly normalize property arrays across common API response wrappers
      const rawList = Array.isArray(data)
        ? data
        : data.properties || data.items || data.data || []

      // Standardize string IDs and title/name fallbacks
      const items: PropertyOption[] = rawList.map((p: any) => ({
        id: String(p.id ?? p._id ?? ''),
        title: p.title || p.name || p.property_name || `Property #${p.id}`,
      }))

      setHostProperties(items)

      if (items.length > 0) {
        setSelectedPropertyId((prev) => prev || items[0].id)
      }
    } catch (err: any) {
      console.error('Failed to load host properties:', err)
      setErrorMessage(err.message || 'Could not load your properties.')
    } finally {
      setIsLoadingProperties(false)
    }
  }

   // Lock background scroll when the modal is open
  useEffect(() => {
    if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }

  return () => {
    document.body.style.overflow = ''
  }
  }, [open])

  // Reset form upon opening
  useEffect(() => {
    if (open) {
      if (!propertyId) {
        setSelectedPropertyId('')
      }
      setTitle('')
      setDescription('')
      setPrice('')
      setCurrency('₦')
      setInventory('')
      setCapacity('2')
      setAmenities([])
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
      setFiles([])
      setPreviewUrls([])
      setIsSubmitting(false)
      setErrorMessage(null)
    }
  }, [open, propertyId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    if (files.length + newFiles.length > MAX_IMAGES) {
      setErrorMessage(`You cannot upload more than ${MAX_IMAGES} images.`)
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

  const canPublish = files.length >= MIN_IMAGES && files.length <= MAX_IMAGES && !!selectedPropertyId && !isSubmitting

  const handleSave = async () => {
    if (!canPublish) return
    if (!selectedPropertyId) {
      setErrorMessage('Please select a target property for this room.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const rawPrice = parseFloat(price.replace(/,/g, '')) || 0
      const formData = new FormData()

      formData.append('title', title.trim() || 'Untitled Room')
      formData.append('description', description.trim() || 'No description provided.')
      formData.append('price_per_night', String(rawPrice))
      formData.append('property_id', selectedPropertyId)

      files.forEach((file) => {
        formData.append('images', file)
      })

      const token = localStorage.getItem('token') || localStorage.getItem('access_token')

      const response = await fetch('/api/v1/rooms/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || 'Failed to upload room and images.')
      }

      const createdRoom = await response.json()

      const roomFormatted: RoomType = {
        id: createdRoom.id,
        title: createdRoom.title,
        description: createdRoom.description,
        price: createdRoom.price_per_night,
        currency: currency,
        inventory: Number(inventory) || 1,
        capacity: capacity,
        amenities: amenities,
        images: createdRoom.images,
        status: 'active',
      }

      onSave(roomFormatted)
      onClose()
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while saving.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const propertyOptions = hostProperties.map((p) => ({
    label: p.title,
    value: p.id,
  }))

  const currencyOptions = CURRENCIES.map((c) => ({
    label: `${c.symbol} ${c.code}`,
    value: c.symbol,
  }))

  return (
    <div className={cn('fixed inset-0 z-50', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}>
      <div className={cn('absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')} onClick={onClose} />

      <div className={cn('absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col bg-white shadow-card-lg transition-transform duration-300', open ? 'translate-x-0' : 'translate-x-full')}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-ink">Add New Room Type</h3>
            <p className="text-xs text-slate-500">Publish a new room listing under your property</p>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-ink disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Property Selection Dropdown */}
          {!propertyId && (
            <div>
              <label className={labelClass}>Target Property</label>
              {isLoadingProperties ? (
                <div className="flex h-11 items-center gap-2 rounded-xl border border-line bg-slate-50 px-3 text-xs text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-600" /> Loading your properties...
                </div>
              ) : hostProperties.length > 0 ? (
                <CustomSelect
                  options={propertyOptions}
                  value={selectedPropertyId}
                  onChange={(val) => setSelectedPropertyId(val)}
                  className="h-11 w-full rounded-xl border border-line bg-white"
                />
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                  <Building2 className="mr-1 inline h-4 w-4" />
                  No properties found. Please create a property branch first before adding rooms.
                </div>
              )}
            </div>
          )}

          {/* Room Title */}
          <div>
            <label htmlFor="room-title" className={labelClass}>Room Title</label>
            <input
              id="room-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deluxe Ocean View Suite"
              className="h-11 w-full rounded-xl border border-line bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="room-desc" className={labelClass}>Description</label>
            <textarea
              id="room-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe room features, view, and bedding..."
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 resize-none"
            />
          </div>

          {/* Pricing & Inventory */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="room-price" className={labelClass}>Pricing (per night)</label>
              <div className="relative z-20 flex h-14 w-full items-center rounded-2xl border border-line bg-white focus-within:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600">
                <div className="relative h-full w-28 shrink-0 border-r border-line">
                  <CustomSelect
                    options={currencyOptions}
                    value={currency}
                    onChange={(val) => setCurrency(val)}
                    className="h-full [&>button]:h-full [&>button]:rounded-l-2xl [&>button]:rounded-r-none [&>button]:border-none [&>button]:bg-transparent"
                  />
                </div>
                <input
                  id="room-price"
                  type="text"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(formatPriceInput(e.target.value))}
                  placeholder="0.00"
                  className="h-full w-full min-w-0 rounded-r-2xl bg-transparent px-4 text-base text-ink focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="room-inventory" className={labelClass}>Total Physical Inventory</label>
              <input
                id="room-inventory"
                type="number"
                min="0"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                placeholder="e.g. 10"
                className="h-14 w-full rounded-2xl border border-line bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <span className={labelClass}>Max Capacity</span>
            <div className="grid grid-cols-4 gap-2">
              {CAPACITY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCapacity(opt)}
                  className={cn(
                    'rounded-xl border py-2.5 text-sm font-semibold transition-all',
                    capacity === opt ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-white text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <span className={labelClass}>Facilities &amp; Amenities</span>
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
                            <span className={cn('grid h-4 w-4 place-items-center rounded border', active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300')}>
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

          {/* Image Upload Area */}
          <div>
            <span className={labelClass}>Room Photos</span>
            <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleFileChange} className="hidden" />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= MAX_IMAGES || isSubmitting}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-slate-50 px-6 py-8 text-center transition-colors hover:border-brand-600 hover:bg-brand-50/40 disabled:opacity-60"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600/10">
                <UploadCloud className="h-6 w-6 text-brand-600" />
              </span>
              <p className="text-sm font-semibold text-ink">
                {files.length >= MAX_IMAGES ? 'Maximum 7 images reached' : 'Click to select photos'}
              </p>
              <p className="text-xs text-slate-500">3 to 7 images required</p>
            </button>

            {previewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
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
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-line bg-white px-6 py-4">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canPublish}
            className="ml-auto flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 disabled:bg-slate-300"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Save &amp; Upload Listing
          </button>
        </div>
      </div>
    </div>
  )
}
import { useEffect, useState, useRef } from 'react'
import { X, UploadCloud, Check, Plus, Loader2 } from 'lucide-react'
import { cn, labelClass } from '../../lib/ui'
import { AMENITY_CATEGORIES, CURRENCIES, CAPACITY_OPTIONS } from '../../data/mockData'
import type { RoomType } from '../../types'
import CustomSelect from '../ui/CustomSelect'

interface RoomFormPanelProps {
  open: boolean
  onClose: () => void
  onSave: (room: RoomType) => void
  propertyId?: string
}

const MIN_IMAGES = 3
const MAX_IMAGES = 7

/**
 * Formats input strings with thousand separators while preserving decimal input
 * (e.g. "160000.5" -> "160,000.5")
 */
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
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('₦')
  const [inventory, setInventory] = useState('')
  const [capacity, setCapacity] = useState('2')
  const [amenities, setAmenities] = useState<string[]>([])
  
  // File upload & request state
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Lock body scroll when the panel is open
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

  // Reset form each time panel opens & revoke object URLs
  useEffect(() => {
    if (open) {
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
  }, [open])

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
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index])
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (id: string) =>
    setAmenities((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))

  const canPublish = files.length >= MIN_IMAGES && files.length <= MAX_IMAGES && !isSubmitting

  const handleSave = async () => {
    if (!canPublish) return
    if (!propertyId) {
      setErrorMessage('No active property selected. Please select or create a property branch first.')
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
      formData.append('property_id', propertyId)

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

  const currencyOptions = CURRENCIES.map((c) => ({
    label: `${c.symbol} ${c.code}`,
    value: c.symbol,
  }))

  return (
    <div className={cn('fixed inset-0 z-50', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}>
      <div
        className={cn('absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />

      <div
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col bg-white shadow-card-lg transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        data-testid="room-form-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-ink">Add New Room Type</h3>
            <p className="text-xs text-slate-500">Publish a new listing to your inventory</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink disabled:opacity-50"
            aria-label="Close"
            data-testid="room-form-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
              {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="room-title" className={labelClass}>
              Room Title
            </label>
            <input
              id="room-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Executive King Suite"
              className="h-11 w-full rounded-xl border border-line bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 transition-all"
              data-testid="room-title-input"
            />
          </div>

          <div>
            <label htmlFor="room-desc" className={labelClass}>
              Description
            </label>
            <textarea
              id="room-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the room, view, bedding and highlights…"
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 transition-all resize-none"
              data-testid="room-description-input"
            />
          </div>

          {/* Combined Grid for Pricing & Inventory */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="room-price" className={labelClass}>
                Pricing (per night)
              </label>
              <div className="relative z-20 flex h-14 w-full items-center rounded-2xl border border-line bg-white focus-within:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600">
                <div className="relative h-full w-28 shrink-0 border-r border-line">
                  <CustomSelect
                    options={currencyOptions}
                    value={currency}
                    onChange={(val) => setCurrency(val)}
                    className="h-full [&>button]:h-full [&>button]:rounded-l-2xl [&>button]:rounded-r-none [&>button]:border-none [&>button]:bg-transparent [&>button]:shadow-none"
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
                  data-testid="room-price-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="room-inventory" className={labelClass}>
                Total Physical Inventory
              </label>
              <input
                id="room-inventory"
                type="number"
                min="0"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                placeholder="e.g. 12"
                className="h-14 w-full rounded-2xl border border-line bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-400 transition-all focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                data-testid="room-inventory-input"
              />
            </div>
          </div>

          {/* Max capacity selector */}
          <div>
            <span className={labelClass}>Max Capacity</span>
            <div className="grid grid-cols-4 gap-2">
              {CAPACITY_OPTIONS.map((opt) => {
                const active = capacity === opt
                const testId = `capacity-option-${opt === '4+' ? '4plus' : opt}`
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCapacity(opt)}
                    className={cn(
                      'rounded-xl border py-2.5 text-sm font-semibold transition-all duration-200',
                      active
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-line bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                    )}
                    data-testid={testId}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Categorised facilities & amenities */}
          <div>
            <span className={labelClass}>Facilities &amp; Amenities</span>
            <div className="space-y-5">
              {AMENITY_CATEGORIES.map((cat) => {
                const CatIcon = cat.icon
                return (
                  <div key={cat.id} data-testid={`amenity-category-${cat.id}`}>
                    <div className="mb-2.5 flex items-center gap-2">
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
                            aria-pressed={active}
                            className={cn(
                              'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200',
                              active
                                ? 'border-brand-600 bg-brand-50 text-brand-700'
                                : 'border-line bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                            )}
                            data-testid={`amenity-toggle-${item.id}`}
                          >
                            <span
                              className={cn(
                                'grid h-5 w-5 flex-none place-items-center rounded-md border transition-colors',
                                active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white',
                              )}
                            >
                              {active && <Check className="h-3.5 w-3.5" />}
                            </span>
                            <ItemIcon className={cn('h-4 w-4 flex-none', active ? 'text-brand-600' : 'text-slate-400')} />
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

          {/* Real file upload section */}
          <div>
            <span className={labelClass}>Room Photos</span>

            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= MAX_IMAGES || isSubmitting}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-slate-50 px-6 py-8 text-center transition-colors hover:border-brand-600 hover:bg-brand-50/40 disabled:cursor-not-allowed disabled:opacity-60"
              data-testid="room-image-dropzone"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600/10">
                <UploadCloud className="h-6 w-6 text-brand-600" />
              </span>
              <p className="text-sm font-semibold text-ink">
                {files.length >= MAX_IMAGES ? 'Maximum of 7 images reached' : 'Click to select photos from device'}
              </p>
              <p className="text-xs text-slate-500">JPG or PNG · 3 to 7 images required</p>
            </button>

            {/* Selected File Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4" data-testid="room-image-grid">
                {previewUrls.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-slate-100"
                    data-testid={`room-image-thumb-${i}`}
                  >
                    <img src={src} alt={`Room preview ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      disabled={isSubmitting}
                      className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white opacity-100 transition-all hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50"
                      aria-label="Delete image"
                      data-testid={`room-image-delete-${i}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload status messaging */}
            <p
              className={cn('mt-2.5 text-xs font-medium', files.length >= MIN_IMAGES && files.length <= MAX_IMAGES ? 'text-emerald-600' : 'text-amber-600')}
              data-testid="image-helper-text"
            >
              {files.length >= MIN_IMAGES && files.length <= MAX_IMAGES
                ? `Great — ready to upload (${files.length} of ${MAX_IMAGES} selected)`
                : `Please select between 3 and 7 images (${files.length} selected)`}
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center gap-3 border-t border-line bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
            data-testid="room-form-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canPublish}
            className="ml-auto flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            data-testid="save-listing-button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading to Cloudinary...
              </>
            ) : (
              <>
                <Plus className="h-[18px] w-[18px]" /> Save &amp; Upload Listing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
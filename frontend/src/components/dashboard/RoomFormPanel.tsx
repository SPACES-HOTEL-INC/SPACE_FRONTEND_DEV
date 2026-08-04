import { useEffect, useState } from 'react'
import { X, UploadCloud, Check, Plus } from 'lucide-react'
import { cn, selectClass, labelClass } from '../../lib/ui'
import { AMENITY_CATEGORIES, CURRENCIES, CAPACITY_OPTIONS, ROOM_IMAGE_POOL } from '../../data/mockData'
import type { RoomType } from '../../types'

interface RoomFormPanelProps {
  open: boolean
  onClose: () => void
  onSave: (room: RoomType) => void
}

const MIN_IMAGES = 3
const MAX_IMAGES = 7

/**
 * Formats input strings with thousand separators while preserving decimal input
 * (e.g. "160000.5" -> "160,000.5")
 */
const formatPriceInput = (val: string) => {
  // Strip non-digit and non-period characters
  const clean = val.replace(/[^0-9.]/g, '')
  
  if (!clean) return ''

  // Split integer and decimal parts (take only the first decimal point)
  const parts = clean.split('.')
  const integerPart = parts[0]
  const decimalPart = parts.length > 1 ? '.' + parts[1].slice(0, 2) : ''

  // Format the integer portion with commas
  const formattedInteger = integerPart ? Number(integerPart).toLocaleString('en-US') : '0'

  return `${formattedInteger}${decimalPart}`
}

export default function RoomFormPanel({ open, onClose, onSave }: RoomFormPanelProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('$')
  const [inventory, setInventory] = useState('')
  const [capacity, setCapacity] = useState('2')
  const [amenities, setAmenities] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])

  // Reset the form each time the panel is opened.
  useEffect(() => {
    if (open) {
      setTitle('')
      setDescription('')
      setPrice('')
      setCurrency('$')
      setInventory('')
      setCapacity('2')
      setAmenities([])
      setImages([])
    }
  }, [open])

  const addImage = () =>
    setImages((prev) => (prev.length >= MAX_IMAGES ? prev : [...prev, ROOM_IMAGE_POOL[prev.length % ROOM_IMAGE_POOL.length]]))
  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index))
  const toggleAmenity = (id: string) =>
    setAmenities((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))

  const canPublish = images.length >= MIN_IMAGES && images.length <= MAX_IMAGES

  const handleSave = () => {
    if (!canPublish) return
    onSave({
      id: `rt-${Date.now()}`,
      title: title.trim() || 'Untitled Room',
      description: description.trim() || 'No description provided.',
      price: parseFloat(price.replace(/,/g, '')) || 0, // Cleans "160,000.50" -> 160000.5 for database/state storage
      currency,
      inventory: Number(inventory) || 0,
      capacity,
      amenities,
      images,
      status: 'active',
    })
    onClose()
  }

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
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink"
            aria-label="Close"
            data-testid="room-form-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
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

          {/* Pricing & Inventory Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Pricing Field */}
            <div>
              <label htmlFor="room-price" className={labelClass}>
                Pricing (per night)
              </label>
              <div className="flex h-11 w-full items-center overflow-hidden rounded-xl border border-line bg-white focus-within:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-full border-r border-line bg-slate-50 px-3 text-sm font-semibold text-ink focus:outline-none"
                  aria-label="Currency"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.symbol}>
                      {c.symbol} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  id="room-price"
                  type="text"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(formatPriceInput(e.target.value))}
                  placeholder="0.00"
                  className="h-full w-full min-w-0 bg-transparent px-3 text-sm text-ink focus:outline-none"
                  data-testid="room-price-input"
                />
              </div>
            </div>

            {/* Inventory Field */}
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
                className="h-11 w-full rounded-xl border border-line bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 transition-all"
                data-testid="room-inventory-input"
              />
            </div>
          </div>

          {/* Max capacity segmented control */}
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

          {/* Image matrix upload */}
          <div>
            <span className={labelClass}>Room Photos</span>

            <button
              type="button"
              onClick={addImage}
              disabled={images.length >= MAX_IMAGES}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-slate-50 px-6 py-8 text-center transition-colors hover:border-brand-600 hover:bg-brand-50/40 disabled:cursor-not-allowed disabled:opacity-60"
              data-testid="room-image-dropzone"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600/10">
                <UploadCloud className="h-6 w-6 text-brand-600" />
              </span>
              <p className="text-sm font-semibold text-ink">
                {images.length >= MAX_IMAGES ? 'Maximum of 7 images reached' : 'Drag & drop or click to add a photo'}
              </p>
              <p className="text-xs text-slate-500">JPG or PNG · 3 to 7 images required</p>
            </button>

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4" data-testid="room-image-grid">
                {images.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-slate-100"
                    data-testid={`room-image-thumb-${i}`}
                  >
                    <img src={src} alt={`Room ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white opacity-100 transition-all hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Delete image"
                      data-testid={`room-image-delete-${i}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Dynamic helper text */}
            <p
              className={cn('mt-2.5 text-xs font-medium', canPublish ? 'text-emerald-600' : 'text-amber-600')}
              data-testid="image-helper-text"
            >
              {canPublish
                ? `Great — ready to publish (Uploaded: ${images.length} of ${MAX_IMAGES})`
                : `Please upload at least 3 images to publish (Uploaded: ${images.length} of ${MAX_IMAGES})`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-line bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
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
            <Plus className="h-[18px] w-[18px]" /> Save Listing
          </button>
        </div>
      </div>
    </div>
  )
}
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../lib/ui'

export interface SelectOption {
  label: string
  value: string | number
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string | number
  onChange: (value: any) => void
  placeholder?: string
  icon?: React.ReactNode
  className?: string
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  icon,
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-14 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-left text-slate-800 shadow-sm transition-all duration-200 focus:outline-none',
          isOpen ? 'border-teal-600 ring-2 ring-teal-600/10' : 'hover:border-slate-300'
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {icon && <span className="text-slate-400">{icon}</span>}
          <span className="truncate text-base font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn('h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-slate-900/5 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition-colors',
                    isSelected
                      ? 'bg-teal-50 text-teal-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-teal-700" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/ui'

interface RoomImageCarouselProps {
  images: string[]
  title: string
  testId: string // usually the room id, keeps nested test ids unique per card
}

/**
 * RoomImageCarousel — an interactive image slider used on each room card.
 *
 * State flow: `index` tracks the active slide. Prev/Next chevrons and the dot
 * indicators mutate `index` (wrapping around). All handlers stopPropagation so
 * clicking the controls never triggers the parent card. A crisp aspect-[4/3]
 * wrapper with object-cover prevents any cropping/distortion.
 */
export default function RoomImageCarousel({ images, title, testId }: RoomImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const count = images.length

  const go = (dir: number) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setIndex((i) => (i + dir + count) % count)
  }
  const goTo = (i: number) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setIndex(i)
  }

  return (
    <div
      className="group/carousel relative aspect-[4/3] w-full overflow-hidden bg-slate-100"
      data-testid={`${testId}-carousel`}
    >
      {/* Sliding track */}
      <div
        className="flex h-full w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={`${title} — photo ${i + 1}`}
            className="h-full w-full flex-none object-cover"
            loading="lazy"
          />
        ))}
      </div>

      {count > 1 && (
        <>
          {/* Chevrons — visible on tap (mobile) and hover (desktop) */}
          <button
            type="button"
            onClick={go(-1)}
            aria-label="Previous photo"
            data-testid={`${testId}-carousel-prev`}
            className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white md:opacity-0 md:group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={go(1)}
            aria-label="Next photo"
            data-testid={`${testId}-carousel-next`}
            className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white md:opacity-0 md:group-hover/carousel:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={goTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                data-testid={`${testId}-carousel-dot-${i}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/90',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

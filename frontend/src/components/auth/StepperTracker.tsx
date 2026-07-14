import { Check } from 'lucide-react'
import { cn } from '../../lib/ui'

interface Step {
  id: number
  label: string
}

interface StepperTrackerProps {
  steps: Step[]
  current: number // 1-based index of the active step
}

/**
 * Horizontal status stepper shown at the top of the registration wizard.
 * Steps before `current` render as complete (teal + check), the active step is
 * highlighted, and future steps stay muted.
 */
export default function StepperTracker({ steps, current }: StepperTrackerProps) {
  return (
    <ol className="flex items-center" data-testid="signup-stepper">
      {steps.map((step, index) => {
        const isComplete = step.id < current
        const isActive = step.id === current
        const isLast = index === steps.length - 1

        return (
          <li key={step.id} className={cn('flex items-center', !isLast && 'flex-1')}>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'grid h-9 w-9 flex-none place-items-center rounded-full text-sm font-bold transition-all duration-300',
                  isComplete && 'bg-brand-600 text-white',
                  isActive && 'bg-brand-600 text-white ring-4 ring-brand-600/15',
                  !isComplete && !isActive && 'bg-slate-100 text-slate-400 ring-1 ring-line',
                )}
                data-testid={`stepper-node-${step.id}`}
              >
                {isComplete ? <Check className="h-[18px] w-[18px]" /> : step.id}
              </span>
              <div className="hidden sm:block">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Step {step.id}
                </p>
                <p
                  className={cn(
                    'text-sm font-semibold',
                    isActive || isComplete ? 'text-ink' : 'text-slate-400',
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>

            {!isLast && (
              <div className="mx-3 h-0.5 flex-1 rounded-full bg-slate-200 sm:mx-4">
                <div
                  className={cn(
                    'h-full rounded-full bg-brand-600 transition-all duration-500',
                    isComplete ? 'w-full' : 'w-0',
                  )}
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

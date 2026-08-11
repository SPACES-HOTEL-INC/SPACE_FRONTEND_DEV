import { useState, useEffect } from 'react'
import StatsRow from './StatsRow'
import CheckInsQueue from './CheckInsQueue'
import type { Session } from '../../types'

interface OverviewViewProps {
  session: Session
  onNotify: (title: string, message: string) => void
}

// Data structures matching your database schema
interface OverviewStats {
  revenue: number
  occupancyRate: number
  activeBookings: number
}

interface GuestCheckIn {
  id: string
  guestName: string
  roomNumber: string
  status: string
}

// Overview tab: date header, KPI stats row and today's check-ins queue.[cite: 21]
export default function OverviewView({ session, onNotify }: OverviewViewProps) {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [queue, setQueue] = useState<GuestCheckIn[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setIsLoading(true)
        
        // Replace with your actual backend endpoint 
        const response = await fetch('http://localhost:8000/api/overview', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}` // Or your preferred auth method
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const data = await response.json()
        
        // Assuming your backend sends JSON like: { "stats": {...}, "queue": [...] }
        setStats(data.stats)
        setQueue(data.queue)
      } catch (error) {
        console.error("Error fetching overview data:", error)
        onNotify('Data Error', 'Unable to retrieve overview data from the database.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOverviewData()
  }, [session, onNotify])

  return (
    <section data-testid="overview-panel">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            Here's how {session.hotelName} is performing today.
          </p>
        </div>
        <span className="rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-semibold text-slate-600">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="text-slate-500">Loading live data...</div>
        </div>
      ) : (
        <>
          {/* Passing the fetched database data down to child components */}
          <StatsRow data={stats} />
          
          <CheckInsQueue 
            queue={queue}
            onCheckIn={(guest) => onNotify('Check-in complete', `${guest} checked in successfully`)} 
          />
        </>
      )}
    </section>
  )
}
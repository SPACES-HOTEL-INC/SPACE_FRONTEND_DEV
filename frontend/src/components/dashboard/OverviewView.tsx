import { useState, useEffect } from 'react'
import { Home, Calendar, DollarSign, Activity, Loader2, AlertCircle } from 'lucide-react'

// Adjust this to match your sign-in base URL
const API_BASE_URL = 'https://backend-nq9s.onrender.com/api/v1'

// Types based on the OpenAPI schema
interface Property {
  id: string
  hotel_name: string
  property_type: string
  is_active: boolean
}

interface Booking {
  id: string
  total_price: number | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  check_in_date: string
}

interface OverviewData {
  totalRevenue: number
  totalProperties: number
  activeBookings: number
  recentBookings: Booking[]
}

export default function Overview() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchOverviewData = async () => {
      setLoading(true)
      setErrorMessage(null)

      try {
        // Retrieve token from where the SignIn component saved it
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
        
        if (!token) {
          throw new Error('Authentication token not found. Please sign in again.')
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }

        // Fetch Properties and Bookings concurrently
        const [propertiesRes, bookingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/properties/mine`, { headers }),
          fetch(`${API_BASE_URL}/bookings/host-bookings`, { headers })
        ])

        if (!propertiesRes.ok || !bookingsRes.ok) {
          throw new Error('Failed to fetch dashboard data. Please check your connection.')
        }

        const properties: Property[] = await propertiesRes.json()
        const bookings: Booking[] = await bookingsRes.json()

        // Calculate Overview Metrics
        const totalProperties = properties.length
        
        // Active bookings (pending or confirmed)
        const activeBookings = bookings.filter(b => 
          b.status === 'pending' || b.status === 'confirmed'
        ).length

        // Calculate Revenue (Example: sum of completed/confirmed bookings)
        const totalRevenue = bookings
          .filter(b => b.status === 'completed' || b.status === 'confirmed')
          .reduce((sum, booking) => sum + (booking.total_price || 0), 0)

        // Sort by newest check-in dates for recent activity
        const recentBookings = [...bookings]
          .sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime())
          .slice(0, 5)

        if (isMounted) {
          setData({
            totalProperties,
            activeBookings,
            totalRevenue,
            recentBookings
          })
        }
      } catch (err: any) {
        console.error('Overview fetch error:', err)
        if (isMounted) {
          setErrorMessage(err.message || 'Unable to load overview data.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchOverviewData()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
        <p>{errorMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-rise">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-ink">Dashboard Overview</h2>
        <p className="text-sm text-slate-500">Here is what is happening with your properties today.</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Total Revenue</h3>
            <DollarSign className="h-5 w-5 text-brand-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">
            ₦{data?.totalRevenue.toLocaleString()}
          </p>
        </div>

        {/* Active Bookings Card */}
        <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Active Bookings</h3>
            <Calendar className="h-5 w-5 text-brand-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{data?.activeBookings}</p>
        </div>

        {/* Properties Card */}
        <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Properties</h3>
            <Home className="h-5 w-5 text-brand-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{data?.totalProperties}</p>
        </div>
        
        {/* Conversion/Activity Card */}
        <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Status</h3>
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-green-600">Online & Active</p>
        </div>
      </div>
    </div>
  )
}
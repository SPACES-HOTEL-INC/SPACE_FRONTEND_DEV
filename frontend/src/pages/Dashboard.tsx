import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import MiniHeader from '../components/dashboard/MiniHeader'
import OverviewView from '../components/dashboard/OverviewView'
import ManageRooms from '../components/dashboard/ManageRooms'
import Bookings from '../components/dashboard/Bookings'
import Payouts from '../components/dashboard/Payouts'
import StaffModal from '../components/dashboard/StaffModal'
import type { Session, Branch, StaffAccount } from '../types'

interface DashboardProps {
  session: Session
  onSignOut: () => void
}

interface Toast {
  title: string
  message: string
}

interface ApiProperty {
  id: string
  hotel_name: string
  property_type: string
  address: string
  city?: string
}

interface UserProfile {
  id?: string
  full_name?: string
  email?: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-nq9s.onrender.com'

export default function Dashboard({ session, onSignOut }: DashboardProps) {
  const [activeNav, setActiveNav] = useState('overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [, setStaffAccounts] = useState<StaffAccount[]>([])

  useEffect(() => {
    async function loadDashboardData() {
      // 1. Extract raw token string safely
      const rawToken =
        session?.token ||
        localStorage.getItem('token') ||
        localStorage.getItem('access_token') ||
        ''

      const cleanToken = rawToken.replace(/^["']|["']$/g, '').trim()

      // 2. Validate token format (Must have exactly 3 dot-separated JWT segments)
      if (!cleanToken || cleanToken === 'null' || cleanToken === 'undefined' || cleanToken.split('.').length !== 3) {
        console.warn('⚠️ Invalid or missing JWT token. Please sign in again.')
        return
      }

      const headers = {
        Authorization: `Bearer ${cleanToken}`,
        'Content-Type': 'application/json',
      }

      // Fetch User Profile
      try {
        const userRes = await fetch(`${API_BASE_URL}/api/v1/users/me`, { headers })
        if (userRes.ok) {
          const userData = await userRes.json()
          console.log('✅ User profile fetched:', userData)
          setUserProfile(userData)
        } else if (userRes.status === 401) {
          console.warn('⚠️ Session expired or invalid token.')
        }
      } catch (err) {
        console.error('❌ User profile request error:', err)
      }

      // Fetch Host Properties
      try {
        const propRes = await fetch(`${API_BASE_URL}/api/v1/properties/mine`, { headers })
        if (propRes.ok) {
          const propData: ApiProperty[] = await propRes.json()
          console.log('✅ Properties fetched:', propData)

          if (Array.isArray(propData) && propData.length > 0) {
            const mappedBranches: Branch[] = propData.map((prop) => ({
              id: prop.id,
              name: prop.hotel_name,
              propertyType: prop.property_type,
              address: prop.address,
              city: prop.city || '',
            }))
            setBranches(mappedBranches)
          }
        }
      } catch (err) {
        console.error('❌ Properties request error:', err)
      }
    }

    loadDashboardData()
  }, [session])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const notify = (title: string, message: string) => setToast({ title, message })

  const updatedSession: Session = {
    ...session,
    hotelName: branches[0]?.name || userProfile?.full_name || session?.hotelName || 'My Account',
    merchantId: userProfile?.id
      ? `MER-${userProfile.id.slice(0, 4).toUpperCase()}`
      : session?.merchantId || 'MER-HOST',
    user: userProfile || session?.user,
  }

  const handleCreateStaff = (staffData: {
    name: string
    email: string
    pass: string
    branchId: string
  }) => {
    const selectedBranch = branches.find((b) => b.id === staffData.branchId)
    const newStaff: StaffAccount = {
      id: `staff-${Date.now()}`,
      name: staffData.name,
      email: staffData.email,
      role: 'RECEPTIONIST',
      branchId: staffData.branchId,
      createdAt: new Date().toISOString(),
    }
    setStaffAccounts((prev) => [...prev, newStaff])
    notify(
      'Account Created',
      `Receptionist profile created for ${staffData.name} at ${selectedBranch?.name || 'assigned branch'}.`,
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar
        active={activeNav}
        onSelect={setActiveNav}
        mobileOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSignOut={onSignOut}
        session={updatedSession}
        branches={branches}
        onOpenStaffModal={() => setIsStaffModalOpen(true)}
      />

      <div className="lg:pl-[264px]">
        <MiniHeader
          session={updatedSession}
          branches={branches}
          onOpenMenu={() => setMenuOpen(true)}
        />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {activeNav === 'overview' && (
            <OverviewView session={updatedSession} branches={branches} onNotify={notify} />
          )}
          {(activeNav === 'rooms' || activeNav === 'property-type') && (
            <ManageRooms onNotify={notify} />
          )}
          {activeNav === 'bookings' && <Bookings onNotify={notify} />}
          {activeNav === 'payouts' && <Payouts onNotify={notify} />}
        </main>
      </div>

      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        branches={branches}
        onCreateStaff={handleCreateStaff}
      />

      {toast && (
        <div
          className="fixed bottom-5 right-5 z-[60] flex animate-toast-in items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3.5 shadow-card-lg sm:bottom-6 sm:right-6"
          data-testid="app-toast"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink" data-testid="app-toast-title">
              {toast.title}
            </p>
            <p className="text-xs text-slate-500" data-testid="app-toast-message">
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
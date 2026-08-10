// Role definition for access control
export type UserRole = 'CEO' | 'RECEPTIONIST'

// Available property categories
export type PropertyTypeCategory = 'Hotel' | 'Shortlet Apartment' | 'Resort' | 'Villa'

// Property Branch structure for multi-location businesses
export interface Branch {
  id: string
  name: string
  propertyType: PropertyTypeCategory
  address: string
  city: string
  createdAt?: string
}

// Staff / Receptionist profile created by CEO
export interface StaffAccount {
  id: string
  name: string
  email: string
  role: UserRole
  branchId: string // Tied strictly to a specific branch
  createdAt: string
}

// Session state structure
export interface Session {
  userId: string
  role: UserRole
  hotelName: string
  merchantId: string
  email: string
  assignedBranchId?: string // Defined if role is RECEPTIONIST
  availableBranches?: Branch[] // List of branches managed by CEO
}

// Room / Property item structure
export interface RoomType {
  id: string
  branchId: string // Linked to specific branch
  propertyType: PropertyTypeCategory // Hotel, Shortlet, etc.
  name: string // e.g. Executive Suite, 2-Bedroom Apartment
  basePrice: number
  capacity: number
  totalUnits: number
  amenities: string[]
  description?: string
  status: 'available' | 'maintenance' | 'booked'
}

// Booking record structure
export interface Booking {
  id: string
  reference: string
  branchId: string
  guestName: string
  guestEmail: string
  roomTypeName: string
  checkInDate: string
  checkOutDate: string
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  totalAmount: number
  partySize: number
  createdAt: string
}

// Overview statistics interface (CEO aggregated vs. Receptionist branch view)
export interface DashboardStats {
  occupancyRate: number
  activeRooms: number
  dailyRevenue?: number // Only computed/visible for CEO
  pendingArrivalsCount: number
}
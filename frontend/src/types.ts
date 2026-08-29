// Role definition for access control
export type UserRole = 'CEO' | 'RECEPTIONIST'

// Available property categories (Updated to support lowercase variants from your forms)
export type PropertyTypeCategory = 'Hotel' | 'Shortlet Apartment' | 'Resort' | 'Villa' | 'hotel' | 'villa' | 'shortlet' | 'apartment'

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

// Room / Property item structure (Updated fields to align with ManageRooms rendering grid)
export interface RoomType {
  id: string
  branchId: string // Linked to specific branch
  propertyId?: string // Added alignment mapper for UI component
  propertyType: PropertyTypeCategory 
  name: string 
  title?: string // Added alignment mapper for UI card components
  basePrice: number
  price?: number // Added alignment mapper for UI pricing
  capacity: number
  totalUnits: number
  inventory?: number // Added alignment mapper for UI units
  amenities: string[]
  images?: string[] // For the Image carousel
  currency?: string // Currency display configuration
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

// Overview statistics interface
export interface DashboardStats {
  occupancyRate: number
  activeRooms: number
  dailyRevenue?: number 
  pendingArrivalsCount: number
}
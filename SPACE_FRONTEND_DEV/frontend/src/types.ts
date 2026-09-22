export type Page = 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'dashboard'

// Role definition for access control
export type UserRole = 'CEO' | 'RECEPTIONIST'

// Available property categories
export type PropertyTypeCategory = 'Hotel' | 'Shortlet Apartment' | 'Resort' | 'Villa' | 'hotel' | 'villa' | 'shortlet' | 'apartment' | string

export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'Pending' | 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled'
export type PayoutStatus = 'Processing' | 'Completed' | 'Failed' | 'Pending'

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
  userId?: string
  token?: string
  role?: UserRole | string
  hotelName?: string
  merchantId?: string
  email?: string
  assignedBranchId?: string // Defined if role is RECEPTIONIST
  availableBranches?: Branch[] // List of branches managed by CEO
  user?: {
    id?: string
    email?: string
    full_name?: string
    [key: string]: any
  }
}

// Room / Property item structure
export interface RoomType {
  id: string
  branchId?: string
  propertyId?: string
  propertyType?: PropertyTypeCategory 
  name?: string 
  title?: string
  basePrice?: number
  price?: number
  capacity?: number | string
  totalUnits?: number
  inventory?: number
  amenities: string[]
  images?: string[]
  currency?: string
  description?: string
  status?: 'available' | 'maintenance' | 'booked' | 'active'
}

// Booking record structure
export interface Booking {
  id: string
  reference?: string
  branchId?: string
  guestName?: string
  guestEmail?: string
  roomTypeName?: string
  checkInDate?: string
  checkOutDate?: string
  status: BookingStatus
  totalAmount?: number
  partySize?: number
  createdAt?: string
  // Fields used by mock data and UI views
  guest?: string
  initials?: string
  roomType?: string
  checkIn?: string
  checkOut?: string
  nights?: number
  amount?: number
  specialRequest?: string
}

// KPI Statistics
export interface KpiStat {
  id: string
  label: string
  value: string | number
  delta?: string
  change?: string
  trend?: 'up' | 'down'
  icon?: any
  tone?: 'default' | 'success' | 'warning' | 'danger'
}

// Check-In item structure
export interface CheckIn {
  id: string
  guest: string
  initials: string
  room: string
  roomType: string
  arrival: string
  nights: number
  guests: number
  status: string
}

// Navigation Item
export interface NavItem {
  id: string
  label: string
  icon?: any
}

// Amenity Category structures
export interface AmenityItem {
  id: string
  label: string
  icon: any
}

export interface AmenityCategory {
  id: string
  label: string
  icon: any
  items: AmenityItem[]
}

// Payout structures
export interface PayoutRecord {
  id: string
  date: string
  amount: number
  reference: string
  status: PayoutStatus
}

export interface PayoutFinance {
  totalIncome: number
  platformFee: number
  pendingClearance: number
  withdrawnFunds: number
  availableBalance?: number
  pendingPayouts?: number
  totalPaid?: number
}

// Booking Timeline structure
export interface TimelineBlock {
  id: string
  label: string
  start: number
  span: number
  tone: string
}

export interface TimelineRow {
  id: string
  room: string
  blocks: TimelineBlock[]
}

// Overview statistics interface
export interface DashboardStats {
  occupancyRate: number
  activeRooms: number
  dailyRevenue?: number 
  pendingArrivalsCount: number
}
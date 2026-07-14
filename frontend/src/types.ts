import type { LucideIcon } from 'lucide-react'

// The three screen-level views the App router switches between.
export type Page = 'login' | 'signup' | 'dashboard'

// The authenticated hotel/merchant context created on (mock) login/signup and
// handed down to the Dashboard.
export interface Session {
  hotelName: string
  merchantId: string
  email: string
}

// All fields collected across the 3-step registration wizard. Held centrally so
// values persist while the user moves Back/Next between steps.
export interface RegistrationData {
  // Step 1 — Admin Account
  firstName: string
  lastName: string
  mobile: string
  password: string
  // Step 2 — Hotel Profile
  hotelName: string
  propertyType: string
  starRating: string
  address: string
  // Step 3 — Verification & KYC
  taxId: string
  documentName: string
}

export interface KpiStat {
  id: string
  label: string
  value: string
  delta: string
  trend: 'up' | 'down'
  icon: LucideIcon
  tone: 'default' | 'success'
}

export type CheckInStatus = 'pending' | 'checked-in'

export interface CheckIn {
  id: string
  guest: string
  initials: string
  room: string
  roomType: string
  arrival: string
  nights: number
  guests: number
  status: CheckInStatus
}

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

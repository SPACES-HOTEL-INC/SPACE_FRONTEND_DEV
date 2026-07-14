import { Percent, BedDouble, DollarSign, LayoutDashboard, CalendarCheck, Wallet } from 'lucide-react'
import type { KpiStat, CheckIn, NavItem, Session } from '../types'

// Static mock data so the UI compiles and runs fully on the front-end.
// Swap these for real API responses once the backend is wired up.

export const DEMO_SESSION: Session = {
  hotelName: 'Grand Regent Hotel',
  merchantId: 'MER-4820-GR',
  email: 'owner@grandregent.com',
}

export const KPI_STATS: KpiStat[] = [
  {
    id: 'occupancy',
    label: 'Occupancy Rate',
    value: '87.4%',
    delta: '+4.2%',
    trend: 'up',
    icon: Percent,
    tone: 'default',
  },
  {
    id: 'rooms',
    label: 'Active Rooms',
    value: '142',
    delta: '+6',
    trend: 'up',
    icon: BedDouble,
    tone: 'default',
  },
  {
    id: 'revenue',
    label: 'Daily Revenue',
    value: '$38,920',
    delta: '+12.8%',
    trend: 'up',
    icon: DollarSign,
    tone: 'success',
  },
]

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'rooms', label: 'Manage Rooms', icon: BedDouble },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'payouts', label: 'Payouts', icon: Wallet },
]

export const CHECK_INS: CheckIn[] = [
  {
    id: 'g1',
    guest: 'Amelia Hartwell',
    initials: 'AH',
    room: 'Room 1204',
    roomType: 'Executive Suite',
    arrival: '2:30 PM',
    nights: 3,
    guests: 2,
    status: 'pending',
  },
  {
    id: 'g2',
    guest: 'Julian Okafor',
    initials: 'JO',
    room: 'Room 0817',
    roomType: 'Deluxe King',
    arrival: '3:15 PM',
    nights: 1,
    guests: 1,
    status: 'pending',
  },
  {
    id: 'g3',
    guest: 'Priya Nair',
    initials: 'PN',
    room: 'Room 1506',
    roomType: 'Panorama Suite',
    arrival: '4:00 PM',
    nights: 5,
    guests: 2,
    status: 'pending',
  },
  {
    id: 'g4',
    guest: 'Marco Bianchi',
    initials: 'MB',
    room: 'Room 0322',
    roomType: 'Twin Classic',
    arrival: '5:45 PM',
    nights: 2,
    guests: 3,
    status: 'checked-in',
  },
  {
    id: 'g5',
    guest: 'Sofia Andersson',
    initials: 'SA',
    room: 'Room 1101',
    roomType: 'Presidential',
    arrival: '6:20 PM',
    nights: 4,
    guests: 2,
    status: 'pending',
  },
]

export const PROPERTY_TYPES = [
  'Hotel',
  'Resort',
  'Boutique Hotel',
  'Serviced Apartment',
  'Villa / Estate',
  'Guest House',
  'Hostel',
]

export const STAR_RATINGS = ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star']

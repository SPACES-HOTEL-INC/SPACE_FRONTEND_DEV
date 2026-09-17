import type { LucideIcon } from 'lucide-react'
import {
  Percent,
  BedDouble,
  DollarSign,
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  // amenity + category icons
  Bath,
  ShowerHead,
  Wind,
  Droplets,
  Scroll,
  Tv,
  MonitorPlay,
  Cast,
  Plug,
  Snowflake,
  Lamp,
  Wine,
  CookingPot,
  Coffee,
  Croissant,
  Sandwich,
  Utensils,
  BusFront,
  Waves,
  Dumbbell,
  Wifi,
  UtensilsCrossed,
  ConciergeBell,
} from 'lucide-react'
import type {
  KpiStat,
  CheckIn,
  NavItem,
  Session,
  AmenityCategory,
  RoomType,
  Booking,
  PayoutRecord,
  PayoutFinance,
  TimelineRow,
} from '../types'

// Static mock data so the UI compiles and runs fully on the front-end.
// Swap these for real API responses once the backend is wired up.

export const DEMO_SESSION: Session = {
  hotelName: 'Grand Regent Hotel',
  merchantId: 'MER-4820-GR',
  email: 'owner@grandregent.com',
}

export const KPI_STATS: KpiStat[] = [
  { id: 'occupancy', label: 'Occupancy Rate', value: '87.4%', delta: '+4.2%', trend: 'up', icon: Percent, tone: 'default' },
  { id: 'rooms', label: 'Active Rooms', value: '142', delta: '+6', trend: 'up', icon: BedDouble, tone: 'default' },
  { id: 'revenue', label: 'Daily Revenue', value: '$38,920', delta: '+12.8%', trend: 'up', icon: DollarSign, tone: 'success' },
]

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'rooms', label: 'Manage Rooms', icon: BedDouble },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'payouts', label: 'Payouts', icon: Wallet },
]

export const CHECK_INS: CheckIn[] = [
  { id: 'g1', guest: 'Amelia Hartwell', initials: 'AH', room: 'Room 1204', roomType: 'Executive Suite', arrival: '2:30 PM', nights: 3, guests: 2, status: 'pending' },
  { id: 'g2', guest: 'Julian Okafor', initials: 'JO', room: 'Room 0817', roomType: 'Deluxe King', arrival: '3:15 PM', nights: 1, guests: 1, status: 'pending' },
  { id: 'g3', guest: 'Priya Nair', initials: 'PN', room: 'Room 1506', roomType: 'Panorama Suite', arrival: '4:00 PM', nights: 5, guests: 2, status: 'pending' },
  { id: 'g4', guest: 'Marco Bianchi', initials: 'MB', room: 'Room 0322', roomType: 'Twin Classic', arrival: '5:45 PM', nights: 2, guests: 3, status: 'checked-in' },
  { id: 'g5', guest: 'Sofia Andersson', initials: 'SA', room: 'Room 1101', roomType: 'Presidential', arrival: '6:20 PM', nights: 4, guests: 2, status: 'pending' },
]

export const PROPERTY_TYPES = ['Hotel', 'Resort', 'Boutique Hotel', 'Serviced Apartment', 'Villa / Estate', 'Guest House', 'Hostel']
export const STAR_RATINGS = ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star']

// ── Manage Rooms ───────────────────────────────────────────────────────────
// Currency is strictly limited to USD ($) and NGN (₦).
export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'NGN', symbol: '₦' },
]

export const CAPACITY_OPTIONS = ['1', '2', '3', '4+']

// Amenities organised into logical, categorised checklists.
export const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    id: 'bathroom',
    label: 'Bathroom',
    icon: Bath,
    items: [
      { id: 'toilet-paper', label: 'Toilet paper', icon: Scroll },
      { id: 'towels', label: 'Towels', icon: Bath },
      { id: 'hairdryer', label: 'Hairdryer', icon: Wind },
      { id: 'private-bathroom', label: 'Private bathroom', icon: ShowerHead },
      { id: 'toiletries', label: 'Toiletries', icon: Droplets },
    ],
  },
  {
    id: 'media-tech',
    label: 'Media & Tech',
    icon: MonitorPlay,
    items: [
      { id: 'flat-tv', label: 'Flat-screen TV', icon: Tv },
      { id: 'streaming', label: 'Streaming service (Netflix)', icon: MonitorPlay },
      { id: 'cable', label: 'Cable channels', icon: Cast },
    ],
  },
  {
    id: 'room-amenities',
    label: 'Room Amenities',
    icon: BedDouble,
    items: [
      { id: 'socket-bed', label: 'Socket near bed', icon: Plug },
      { id: 'air-conditioning', label: 'Air conditioning', icon: Snowflake },
      { id: 'desk', label: 'Desk', icon: Lamp },
    ],
  },
  {
    id: 'food-drink',
    label: 'Food & Drink',
    icon: UtensilsCrossed,
    items: [
      { id: 'minibar', label: 'Minibar', icon: Wine },
      { id: 'kettle', label: 'Electric kettle', icon: CookingPot },
      { id: 'coffee-maker', label: 'Tea/Coffee maker', icon: Coffee },
      { id: 'breakfast', label: 'Breakfast', icon: Croissant },
      { id: 'lunch', label: 'Lunch', icon: Sandwich },
      { id: 'dinner', label: 'Dinner', icon: Utensils },
    ],
  },
  {
    id: 'general-services',
    label: 'General Services',
    icon: ConciergeBell,
    items: [
      { id: 'airport-shuttle', label: 'Airport shuttle', icon: BusFront },
      { id: 'pool', label: 'Outdoor swimming pool', icon: Waves },
      { id: 'fitness', label: 'Fitness centre', icon: Dumbbell },
      { id: 'free-wifi', label: 'Free WiFi', icon: Wifi },
    ],
  },
]

// Flat lookup: amenity id -> { label, icon, categoryId, categoryLabel }.
export const AMENITY_MAP: Record<
  string,
  { label: string; icon: LucideIcon; categoryId: string; categoryLabel: string }
> = Object.fromEntries(
  AMENITY_CATEGORIES.flatMap((c) =>
    c.items.map((it) => [it.id, { label: it.label, icon: it.icon, categoryId: c.id, categoryLabel: c.label }]),
  ),
)

// Pool of "mock uploaded" images used by the room image matrix + card covers.
export const ROOM_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1515362778563-6a8d0e44bc0b?crop=entropy&cs=srgb&fm=jpg&q=80&w=900',
  'https://images.unsplash.com/photo-1631049307290-bb947b114627?crop=entropy&cs=srgb&fm=jpg&q=80&w=900',
  'https://images.unsplash.com/photo-1685592437742-3b56edb46b15?crop=entropy&cs=srgb&fm=jpg&q=80&w=900',
  'https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=srgb&fm=jpg&q=80&w=900',
  'https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1572177215152-32f247303126?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=900',
  'https://images.pexels.com/photos/7746092/pexels-photo-7746092.jpeg?auto=compress&cs=tinysrgb&w=900',
]

export const ROOM_TYPES: RoomType[] = [
  {
    id: 'rt-exec-king',
    title: 'Executive King Suite',
    description: 'Corner suite with a king bed, lounge area and skyline views.',
    price: 420,
    currency: '$',
    inventory: 12,
    capacity: '2',
    amenities: ['free-wifi', 'air-conditioning', 'flat-tv', 'minibar', 'coffee-maker', 'private-bathroom', 'toiletries'],
    images: [ROOM_IMAGE_POOL[2], ROOM_IMAGE_POOL[0], ROOM_IMAGE_POOL[4]],
    status: 'active',
  },
  {
    id: 'rt-deluxe-twin',
    title: 'Deluxe Twin Room',
    description: 'Spacious twin room ideal for business travellers and families.',
    price: 260,
    currency: '$',
    inventory: 24,
    capacity: '3',
    amenities: ['free-wifi', 'air-conditioning', 'flat-tv', 'towels', 'hairdryer', 'desk'],
    images: [ROOM_IMAGE_POOL[3], ROOM_IMAGE_POOL[1], ROOM_IMAGE_POOL[5]],
    status: 'active',
  },
  {
    id: 'rt-panorama',
    title: 'Panorama Corner Suite',
    description: 'Floor-to-ceiling windows, soaking tub and premium furnishings.',
    price: 610,
    currency: '$',
    inventory: 6,
    capacity: '2',
    amenities: ['free-wifi', 'air-conditioning', 'flat-tv', 'streaming', 'minibar', 'private-bathroom', 'pool', 'toiletries'],
    images: [ROOM_IMAGE_POOL[0], ROOM_IMAGE_POOL[5], ROOM_IMAGE_POOL[7], ROOM_IMAGE_POOL[2]],
    status: 'active',
  },
  {
    id: 'rt-garden-villa',
    title: 'Garden Villa',
    description: 'Private villa with garden access, perfect for longer stays.',
    price: 980,
    currency: '$',
    inventory: 4,
    capacity: '4+',
    amenities: ['free-wifi', 'air-conditioning', 'flat-tv', 'minibar', 'kettle', 'pool', 'fitness', 'airport-shuttle'],
    images: [ROOM_IMAGE_POOL[1], ROOM_IMAGE_POOL[6], ROOM_IMAGE_POOL[3]],
    status: 'active',
  },
  {
    id: 'rt-classic-queen',
    title: 'Classic Queen Room',
    description: 'Comfortable queen room with all essential amenities.',
    price: 190,
    currency: '$',
    inventory: 30,
    capacity: '2',
    amenities: ['free-wifi', 'air-conditioning', 'flat-tv', 'towels', 'socket-bed'],
    images: [ROOM_IMAGE_POOL[4], ROOM_IMAGE_POOL[7], ROOM_IMAGE_POOL[0]],
    status: 'active',
  },
]

// ── Bookings ───────────────────────────────────────────────────────────────
export const BOOKING_STATUSES: Booking['status'][] = ['Pending', 'Confirmed', 'Checked-In', 'Completed', 'Cancelled']

export const BOOKINGS: Booking[] = [
  { id: 'bk-1001', guest: 'Amelia Hartwell', initials: 'AH', roomType: 'Executive King Suite', checkIn: 'Jun 16, 2026', checkOut: 'Jun 19, 2026', nights: 3, amount: 1260, status: 'Confirmed', specialRequest: 'Requested a late check-in at 11:00 PM and a baby cot.' },
  { id: 'bk-1002', guest: 'Julian Okafor', initials: 'JO', roomType: 'Deluxe Twin Room', checkIn: 'Jun 16, 2026', checkOut: 'Jun 17, 2026', nights: 1, amount: 260, status: 'Checked-In', specialRequest: 'Non-smoking room on a high floor, please.' },
  { id: 'bk-1003', guest: 'Priya Nair', initials: 'PN', roomType: 'Panorama Corner Suite', checkIn: 'Jun 18, 2026', checkOut: 'Jun 23, 2026', nights: 5, amount: 3050, status: 'Pending', specialRequest: 'Early check-in requested — celebrating an anniversary.' },
  { id: 'bk-1004', guest: 'Marco Bianchi', initials: 'MB', roomType: 'Classic Queen Room', checkIn: 'Jun 12, 2026', checkOut: 'Jun 14, 2026', nights: 2, amount: 380, status: 'Completed', specialRequest: 'Extra pillows and a quiet room away from the elevator.' },
  { id: 'bk-1005', guest: 'Sofia Andersson', initials: 'SA', roomType: 'Garden Villa', checkIn: 'Jun 20, 2026', checkOut: 'Jun 24, 2026', nights: 4, amount: 3920, status: 'Confirmed', specialRequest: 'Airport pickup at 3:00 PM and a vegetarian breakfast.' },
  { id: 'bk-1006', guest: 'David Kim', initials: 'DK', roomType: 'Deluxe Twin Room', checkIn: 'Jun 11, 2026', checkOut: 'Jun 13, 2026', nights: 2, amount: 520, status: 'Cancelled', specialRequest: 'No special requests.' },
  { id: 'bk-1007', guest: 'Elena Rossi', initials: 'ER', roomType: 'Executive King Suite', checkIn: 'Jun 17, 2026', checkOut: 'Jun 20, 2026', nights: 3, amount: 1260, status: 'Checked-In', specialRequest: 'Connecting rooms for family; late checkout if possible.' },
  { id: 'bk-1008', guest: 'Thomas Wright', initials: 'TW', roomType: 'Panorama Corner Suite', checkIn: 'Jun 22, 2026', checkOut: 'Jun 25, 2026', nights: 3, amount: 1830, status: 'Confirmed', specialRequest: 'Allergic to feathers — hypoallergenic bedding required.' },
  { id: 'bk-1009', guest: 'Aisha Bello', initials: 'AB', roomType: 'Classic Queen Room', checkIn: 'Jun 09, 2026', checkOut: 'Jun 12, 2026', nights: 3, amount: 570, status: 'Completed', specialRequest: 'Requested a room with a bathtub and city view.' },
  { id: 'bk-1010', guest: 'Liam Murphy', initials: 'LM', roomType: 'Garden Villa', checkIn: 'Jun 25, 2026', checkOut: 'Jun 30, 2026', nights: 5, amount: 4900, status: 'Pending', specialRequest: 'Twin beds instead of a king; extra towels.' },
]

// Days + booked-duration blocks for the Bookings visual timeline.
export const TIMELINE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const BOOKING_TIMELINE: TimelineRow[] = [
  {
    id: 'tl-101',
    room: 'Deluxe Suite · Room 101',
    blocks: [
      { id: 'blk-101a', label: 'A. Hartwell', start: 1, span: 3, tone: 'primary' },
      { id: 'blk-101b', label: 'Okafor', start: 6, span: 2, tone: 'secondary' },
    ],
  },
  {
    id: 'tl-402',
    room: 'Penthouse · Room 402',
    blocks: [{ id: 'blk-402a', label: 'S. Andersson', start: 5, span: 3, tone: 'primary' }],
  },
  {
    id: 'tl-214',
    room: 'Executive King · Room 214',
    blocks: [{ id: 'blk-214a', label: 'E. Rossi', start: 2, span: 3, tone: 'tertiary' }],
  },
  {
    id: 'tl-05',
    room: 'Garden Villa · 05',
    blocks: [{ id: 'blk-05a', label: 'Murphy', start: 6, span: 2, tone: 'secondary' }],
  },
]

// ── Payouts ────────────────────────────────────────────────────────────────
// Available Balance = TotalIncome - (PlatformFee + PendingClearance + Withdrawn)
export const PAYOUT_FINANCE: PayoutFinance = {
  totalIncome: 128450,
  platformFee: 9633.75,
  pendingClearance: 4820,
  withdrawnFunds: 72000,
}

export const BANK_OPTIONS = [
  'Access Bank',
  'Guaranty Trust Bank (GTBank)',
  'Zenith Bank',
  'United Bank for Africa (UBA)',
  'First Bank of Nigeria',
  'Moniepoint MFB',
  'OPay',
  'Kuda Bank',
]

// USD -> NGN conversion rate used across the dual-currency payouts view.
// (base available $41,996.25 * 1500 = ₦62,994,375)
export const NGN_RATE = 1500

export const PAYOUT_HISTORY: PayoutRecord[] = [
  { id: 'po-1', date: 'Jun 02, 2026', amount: 9300, reference: 'PZ-1B8C55', status: 'Processing' },
  { id: 'po-2', date: 'May 28, 2026', amount: 12500, reference: 'PZ-9F3A21', status: 'Completed' },
  { id: 'po-3', date: 'May 14, 2026', amount: 8200, reference: 'PZ-7C1B08', status: 'Completed' },
  { id: 'po-4', date: 'Apr 30, 2026', amount: 15750, reference: 'PZ-5A9E44', status: 'Completed' },
  { id: 'po-5', date: 'Apr 16, 2026', amount: 6400, reference: 'PZ-3D2F77', status: 'Failed' },
]

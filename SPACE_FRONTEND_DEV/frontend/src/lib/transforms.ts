import type { HostBooking } from './api'
import type { Booking, BookingStatus } from '../types'

const statusMap: Record<string, BookingStatus> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked-In',
  checked_out: 'Completed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'Cancelled',
}

function toInitials(name?: string) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('')
  return initials
}

function formatDate(iso?: string) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
  } catch (_e) {
    return iso
  }
}

export function mapHostBookingToBooking(h: HostBooking): Booking {
  const statusKey = (h.status || '').toLowerCase()
  const status: BookingStatus = statusMap[statusKey] || 'Pending'

  return {
    id: h.id,
    guest: h.guest_name || '',
    initials: toInitials(h.guest_name),
    roomType: h.room_title || '',
    checkIn: formatDate(h.check_in_date),
    checkOut: formatDate(h.check_out_date),
    nights: h.num_nights || 0,
    amount: h.total_price || 0,
    status,
    specialRequest: h.special_requests || '',
  }
}

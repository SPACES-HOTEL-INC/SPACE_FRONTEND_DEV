export function getStoredAuthToken(): string {
  if (typeof window === 'undefined') return ''

  return (
    localStorage.getItem('token') ||
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    ''
  )
}

// Ensure API base URL points to the Render backend environment
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://backend-nq9s.onrender.com'

export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit) {
  const token = getStoredAuthToken()
  const headers = new Headers(init?.headers as HeadersInit || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)

  // Prepend API_BASE_URL if input is a relative path starting with '/'
  let url = input
  if (typeof input === 'string' && input.startsWith('/')) {
    url = `${API_BASE_URL}${input}`
  }

  const response = await fetch(url, { ...(init || {}), headers })

  if (!response.ok) {
    let body: any = {}
    try {
      body = await response.json()
    } catch (_e) {
      // ignore parse errors
    }

    if (response.status === 401) {
      throw new Error(body.detail || 'Unauthorized. Please sign in again.')
    }
    if (response.status === 403) {
      throw new Error(body.detail || 'Forbidden. Host access required.')
    }
    if (response.status === 422) {
      const detail = body.detail
      if (Array.isArray(detail)) {
        const msgs = detail.map((d: any) => {
          if (typeof d === 'string') return d
          return `${d.loc?.slice(-1)[0] || 'field'}: ${d.msg || JSON.stringify(d)}`
        })
        throw new Error(msgs.join(', '))
      }
      throw new Error(detail || body.message || 'Validation failed.')
    }

    throw new Error(body.detail || body.message || `Request failed with status ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

// Define support types matching API Swagger spec
export interface SupportTicket {
  id: string
  subject: string
  date: string
  status: 'Open' | 'In Progress' | 'Resolved' | string
  message?: string
}

export interface CreateTicketPayload {
  subject: string
  message: string
}

// GET: Fetch user support tickets
export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  // fetchWithAuth automatically prepends API_BASE_URL and parses JSON
  const data = await fetchWithAuth('/api/v1/support/tickets')
  return data
}

// POST: Create a new support ticket
export async function createSupportTicket(payload: CreateTicketPayload): Promise<SupportTicket> {
  const data = await fetchWithAuth('/api/v1/support/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return data
}

// Booking types for host bookings
export interface HostBooking {
  id: string;
  guest_id: string;
  guest_name?: string;
  guest_email?: string;
  room_id: string;
  room_title?: string;
  property_id?: string;
  property_name?: string;
  check_in_date: string;
  check_out_date: string;
  num_nights: number;
  total_price: number;
  status: string;
  special_requests?: string;
  created_at: string;
  updated_at?: string;
}

// GET: Fetch bookings for host properties
export async function fetchHostBookings(): Promise<HostBooking[]> {
  const data: any = await fetchWithAuth('/api/v1/bookings/host-bookings');

  // Normalise common API shapes -> always return an array of HostBooking
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.bookings)) return data.bookings

  // If the server returned a single object for some reason, wrap it
  if (typeof data === 'object') return [data]

  return []
}

// Try to fetch weekly availability rows derived from host bookings.
// If the backend exposes a dedicated endpoint in future we can switch to it.
export async function fetchWeeklyAvailability(): Promise<any[]> {
  try {
    // Attempt a dedicated availability endpoint first (non-fatal if 404)
    const resp: any = await fetchWithAuth('/api/v1/availability/weekly')
    if (Array.isArray(resp)) return resp
    if (Array.isArray(resp.data)) return resp.data
  } catch (_e) {
    // ignore and fallback to deriving from bookings
  }

  // Fallback: derive availability from host bookings
  try {
    const bookings = await fetchHostBookings()
    return bookings
  } catch (_e) {
    return []
  }
}
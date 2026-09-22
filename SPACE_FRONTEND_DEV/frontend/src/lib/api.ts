export function getStoredAuthToken(): string {
  if (typeof window === 'undefined') return ''

  return (
    localStorage.getItem('token') ||
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    ''
  )
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getStoredAuthToken()
  const headers = new Headers(init?.headers as HeadersInit || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(input, { ...(init || {}), headers })

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

// Define support types if not already present in types.ts
export interface SupportTicket {
  id: string;
  subject: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved' | string;
  message?: string;
}

export interface CreateTicketPayload {
  subject: string;
  message: string;
}

// GET: Fetch user support tickets
export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  // fetchWithAuth already checks response.ok and returns parsed JSON
  const data = await fetchWithAuth('/api/v1/support/tickets');
  return data;
}

// POST: Create a new support ticket
export async function createSupportTicket(payload: CreateTicketPayload): Promise<SupportTicket> {
  // fetchWithAuth automatically stringifies error responses or returns parsed JSON
  const data = await fetchWithAuth('/api/v1/support/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return data;
}
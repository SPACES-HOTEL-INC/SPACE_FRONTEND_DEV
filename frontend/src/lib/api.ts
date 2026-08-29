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

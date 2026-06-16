import { readStoredAccessToken } from '../../services/auth-service/auth-session.storage'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

interface ApiErrorPayload {
  message?: string
  error?: string
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const accessToken = readStoredAccessToken()
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: buildHeaders(accessToken),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (!response.ok) {
    throw await createApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export async function apiRequestOrNull<T>(path: string): Promise<T | null> {
  const accessToken = readStoredAccessToken()

  if (!accessToken) {
    return null
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'GET',
    headers: buildHeaders(accessToken),
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw await createApiError(response)
  }

  if (response.status === 204) {
    return null
  }

  return (await response.json()) as T
}

async function createApiError(response: Response) {
  let message = `Request failed with status ${response.status}.`

  try {
    const payload = (await response.json()) as ApiErrorPayload
    message = payload.message ?? payload.error ?? message
  } catch {
    message = response.statusText || message
  }

  return new Error(message)
}

function buildHeaders(accessToken: string | null): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  }
}

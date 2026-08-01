import { API_BASE_URL } from '@/shared/config'

export type ApiErrorData = {
  message: string
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: ApiErrorData | null
  ) {
    super(data?.message ?? `API error ${status}`)
    this.name = 'ApiError'
  }
}

export type ApiRequestInit = RequestInit & {
  /**
   * Prefix for the request path. Defaults to the external API base url.
   * Pass an empty string for route handlers of this very app — they live on the same
   * origin and must not be sent to the backend host.
   */
  baseUrl?: string
}

async function apiFetch(path: string, init?: ApiRequestInit): Promise<Response> {
  const { baseUrl = API_BASE_URL, ...requestInit } = init ?? {}

  const response = await fetch(`${baseUrl}${path}`, {
    ...requestInit,
    headers: {
      'Content-Type': 'application/json',
      ...requestInit.headers,
    },
  })

  if (!response.ok) {
    const data: ApiErrorData | null = await response.json().catch(() => null)
    throw new ApiError(response.status, data)
  }

  return response
}

export const api = {
  post: (path: string, body: unknown, init?: Omit<ApiRequestInit, 'body' | 'method'>) =>
    apiFetch(path, { ...init, method: 'POST', body: JSON.stringify(body) }),

  get: (path: string, init?: Omit<ApiRequestInit, 'method'>) =>
    apiFetch(path, { ...init, method: 'GET' }),

  patch: (path: string, body: unknown, init?: Omit<ApiRequestInit, 'body' | 'method'>) =>
    apiFetch(path, { ...init, method: 'PATCH', body: JSON.stringify(body) }),

  delete: (path: string, init?: Omit<ApiRequestInit, 'method'>) =>
    apiFetch(path, { ...init, method: 'DELETE' }),
}

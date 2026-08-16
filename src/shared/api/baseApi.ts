import { API_BASE_URL } from '@/shared/config'

export type ApiErrorData = {
  message: string | string[]
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: ApiErrorData | null
  ) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : (data?.message ?? `API error ${status}`)

    super(message)
    this.name = 'ApiError'
  }
}

export type ApiRequestInit = RequestInit & {
  /**
   * Prefix for the request path. Defaults to the external API base url.
   * Pass an empty string for route handlers of this app; they live on the same
   * origin and must not be sent to the backend host.
   */
  baseUrl?: string
}

async function apiFetch(path: string, init?: ApiRequestInit): Promise<Response> {
  const { baseUrl = API_BASE_URL, ...requestInit } = init ?? {}
  const hasJsonBody = requestInit.body !== undefined && !(requestInit.body instanceof FormData)

  const response = await fetch(`${baseUrl}${path}`, {
    ...requestInit,
    headers: {
      // Only a request that carries a body describes its type; GET and DELETE send none.
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : null),
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

  postForm: (path: string, body: FormData, init?: Omit<ApiRequestInit, 'body' | 'method'>) =>
    apiFetch(path, { ...init, method: 'POST', body }),

  get: (path: string, init?: Omit<ApiRequestInit, 'method'>) =>
    apiFetch(path, { ...init, method: 'GET' }),

  patch: (path: string, body: unknown, init?: Omit<ApiRequestInit, 'body' | 'method'>) =>
    apiFetch(path, { ...init, method: 'PATCH', body: JSON.stringify(body) }),

  put: (path: string, body: unknown, init?: Omit<ApiRequestInit, 'body' | 'method'>) =>
    apiFetch(path, { ...init, method: 'PUT', body: JSON.stringify(body) }),

  delete: (path: string, init?: Omit<ApiRequestInit, 'method'>) =>
    apiFetch(path, { ...init, method: 'DELETE' }),
}

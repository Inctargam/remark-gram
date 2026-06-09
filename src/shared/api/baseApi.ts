const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

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

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const data: ApiErrorData | null = await response.json().catch(() => null)
    throw new ApiError(response.status, data)
  }

  return response
}

export const api = {
  post: (path: string, body: unknown, init?: Omit<RequestInit, 'body' | 'method'>) =>
    apiFetch(path, { ...init, method: 'POST', body: JSON.stringify(body) }),

  get: (path: string, init?: Omit<RequestInit, 'method'>) =>
    apiFetch(path, { ...init, method: 'GET' }),
}

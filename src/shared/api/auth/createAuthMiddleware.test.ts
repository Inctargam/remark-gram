import createClient from 'openapi-fetch'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { paths } from '@/shared/api/openapi/schema'
import { sessionStore } from '@/shared/auth'

import { createAuthMiddleware } from './createAuthMiddleware'

const API_BASE_URL = 'https://remark-gram.com'

const createTestClient = ({
  fetchMock,
  refreshAccessToken,
}: {
  fetchMock: typeof fetch
  refreshAccessToken: () => Promise<string | null>
}) => {
  const client = createClient<paths>({ baseUrl: API_BASE_URL, fetch: fetchMock })
  client.use(createAuthMiddleware({ refreshAccessToken }))

  return client
}

describe('createAuthMiddleware', () => {
  afterEach(() => {
    sessionStore.setState({ accessToken: null, status: 'loading' })
    vi.restoreAllMocks()
  })

  it('adds the access token, refreshes after 401 and retries once', async () => {
    sessionStore.getState().setAuthenticated('expired-token')
    const refreshAccessToken = vi.fn().mockResolvedValue('new-token')
    const fetchMock = vi.fn(async (request: RequestInfo | URL) => {
      const currentRequest = new Request(request)

      return currentRequest.headers.get('Authorization') === 'Bearer new-token'
        ? Response.json([])
        : new Response(null, { status: 401 })
    })
    const client = createTestClient({ fetchMock, refreshAccessToken })

    const { response } = await client.GET('/api/v1/security/sessions')

    expect(response.status).toBe(200)
    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not refresh a request sent without an access token', async () => {
    sessionStore.getState().setGuest()
    const refreshAccessToken = vi.fn().mockResolvedValue('new-token')
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }))
    const client = createTestClient({ fetchMock, refreshAccessToken })

    const { response } = await client.GET('/api/v1/security/sessions')

    expect(response.status).toBe(401)
    expect(refreshAccessToken).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('skips Bearer and refresh for a request with auth disabled', async () => {
    sessionStore.getState().setAuthenticated('access-token')
    const refreshAccessToken = vi.fn().mockResolvedValue('new-token')
    const fetchMock = vi.fn(async (request: RequestInfo | URL) => {
      const currentRequest = new Request(request)

      expect(currentRequest.headers.has('Authorization')).toBe(false)

      return new Response(null, { status: 401 })
    })
    const client = createTestClient({ fetchMock, refreshAccessToken })

    const { response } = await client.POST('/api/v1/auth/refresh-token', { auth: false })

    expect(response.status).toBe(401)
    expect(refreshAccessToken).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('clears the session when the retried request is still unauthorized', async () => {
    sessionStore.getState().setAuthenticated('expired-token')
    const refreshAccessToken = vi.fn().mockResolvedValue('rejected-token')
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }))
    const client = createTestClient({ fetchMock, refreshAccessToken })

    const { response } = await client.GET('/api/v1/security/sessions')

    expect(response.status).toBe(401)
    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(sessionStore.getState()).toMatchObject({ accessToken: null, status: 'guest' })
  })
})

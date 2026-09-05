import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { sessionStore } from '@/shared/auth/sessionStore'

vi.mock('@/shared/config', () => ({ API_BASE_URL: 'https://backend.example.com' }))

const fetchMock = vi.fn()

vi.stubGlobal('fetch', fetchMock)

const { apiClient } = await import('./client')

const getRequest = () => fetchMock.mock.calls[0]?.[0] as Request

beforeEach(() => {
  fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
})

afterEach(() => {
  fetchMock.mockReset()
  sessionStore.setState({ accessToken: null, currentUser: null, status: 'loading' })
})

describe('apiClient auth middleware', () => {
  it('adds the bearer token from the session store', async () => {
    sessionStore.getState().setAuthenticated('access-token')

    await apiClient.POST('/api/v1/auth/logout')

    expect(getRequest().headers.get('Authorization')).toBe('Bearer access-token')
  })

  it('omits authorization when there is no access token', async () => {
    sessionStore.getState().setGuest()

    await apiClient.POST('/api/v1/auth/logout')

    expect(getRequest().headers.has('Authorization')).toBe(false)
  })
})

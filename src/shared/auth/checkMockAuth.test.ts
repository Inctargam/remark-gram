import { afterEach, describe, expect, it, vi } from 'vitest'

import { checkMockAuth } from './checkMockAuth'
import { sessionStore } from './sessionStore'

const CURRENT_USER = {
  avatarUrl: null,
  email: 'user@example.com',
  id: 'mock-user-1',
  username: 'UserName',
}

describe('checkMockAuth', () => {
  afterEach(() => {
    sessionStore.setState({ accessToken: null, currentUser: null, status: 'loading' })
    vi.unstubAllGlobals()
  })

  it('stores the current user returned by mock /me', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(CURRENT_USER))

    vi.stubGlobal('fetch', fetchMock)

    await checkMockAuth()

    expect(fetchMock).toHaveBeenCalledWith('/api/mock/auth/me', {
      headers: { Authorization: 'Bearer mock-token' },
    })
    expect(sessionStore.getState()).toMatchObject({
      accessToken: 'mock-token',
      currentUser: CURRENT_USER,
      status: 'authenticated',
    })
  })

  it('clears the current user when mock /me rejects the session', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ message: 'Unauthorized' }, { status: 401 }))
    )

    await checkMockAuth()

    expect(sessionStore.getState()).toMatchObject({
      accessToken: null,
      currentUser: null,
      status: 'guest',
    })
  })
})

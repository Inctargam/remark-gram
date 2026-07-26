import { afterEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from '@/shared/api/openapi'
import { sessionStore } from '@/shared/auth'

import { logout } from './useLogoutMutation'

describe('logout', () => {
  afterEach(() => {
    sessionStore.setState({ accessToken: null, status: 'loading' })
    vi.restoreAllMocks()
  })

  it('clears the local session even when the backend request fails', async () => {
    sessionStore.getState().setAuthenticated('access-token')
    const logoutError = new Error('Backend is unavailable')
    const postMock = vi.spyOn(apiClient, 'POST').mockRejectedValue(logoutError)

    await expect(logout()).resolves.toBeUndefined()
    expect(postMock).toHaveBeenCalledWith('/api/v1/auth/logout')
    expect(sessionStore.getState()).toMatchObject({ accessToken: null, status: 'guest' })
  })
})

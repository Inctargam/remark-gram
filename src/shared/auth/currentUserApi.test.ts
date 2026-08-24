import type { Client } from 'openapi-fetch'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { paths } from '@/shared/api/openapi/schema'

import {
  clearCurrentUserLoadFailure,
  createLoadCurrentUser,
  CurrentUserLoadError,
  hasRecentCurrentUserLoadFailure,
} from './currentUserApi'
import { sessionStore } from './sessionStore'

type CurrentUserApiClient = Pick<Client<paths>, 'GET'>

const createApiClient = (getMock: ReturnType<typeof vi.fn>) =>
  ({ GET: getMock }) as unknown as CurrentUserApiClient

const CURRENT_USER_RESPONSE = {
  avatarUrl: null,
  createdAt: '2026-08-21T10:15:00.000Z',
  email: 'user@example.com',
  emailVerified: true,
  id: 7,
  loginMethods: ['password'] as const,
  username: 'UserName',
}

describe('createLoadCurrentUser', () => {
  afterEach(() => {
    clearCurrentUserLoadFailure()
    sessionStore.setState({ accessToken: null, currentUser: null, status: 'loading' })
    vi.restoreAllMocks()
  })

  it('loads and stores the current authenticated user', async () => {
    const getMock = vi.fn().mockResolvedValue({
      data: CURRENT_USER_RESPONSE,
      response: new Response(null, { status: 200 }),
    })
    const loadCurrentUser = createLoadCurrentUser(createApiClient(getMock))

    sessionStore.getState().setAuthenticated('access-token')

    await expect(loadCurrentUser()).resolves.toEqual({
      avatarUrl: null,
      email: 'user@example.com',
      id: '7',
      username: 'UserName',
    })
    expect(getMock).toHaveBeenCalledWith('/api/v1/auth/me')
    expect(sessionStore.getState()).toMatchObject({
      accessToken: 'access-token',
      currentUser: {
        avatarUrl: null,
        email: 'user@example.com',
        id: '7',
        username: 'UserName',
      },
      status: 'authenticated',
    })
  })

  it('clears the session when the current user cannot be loaded', async () => {
    const getMock = vi.fn().mockResolvedValue({
      data: undefined,
      response: new Response(null, { status: 401 }),
    })
    const loadCurrentUser = createLoadCurrentUser(createApiClient(getMock))

    sessionStore.getState().setAuthenticated('access-token')

    await expect(loadCurrentUser()).resolves.toBeNull()
    expect(sessionStore.getState()).toMatchObject({
      accessToken: null,
      currentUser: null,
      status: 'guest',
    })
  })

  it('preserves the access token and records a recent failure when the backend fails', async () => {
    const getMock = vi.fn().mockResolvedValue({
      data: undefined,
      response: new Response(null, { status: 500 }),
    })
    const loadCurrentUser = createLoadCurrentUser(createApiClient(getMock))

    sessionStore.getState().setAuthenticated('access-token')

    await expect(loadCurrentUser()).rejects.toMatchObject(new CurrentUserLoadError(500))
    expect(hasRecentCurrentUserLoadFailure()).toBe(true)
    expect(sessionStore.getState()).toMatchObject({
      accessToken: 'access-token',
      currentUser: null,
      status: 'authenticated',
    })
  })
})

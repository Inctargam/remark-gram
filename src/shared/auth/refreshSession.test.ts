import type { Client } from 'openapi-fetch'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { paths } from '@/shared/api/openapi/schema'

import { clearCurrentUserLoadFailure, hasRecentCurrentUserLoadFailure } from './currentUserApi'
import { createRefreshSession } from './refreshSession'
import { sessionStore } from './sessionStore'

type SessionApiClient = Pick<Client<paths>, 'GET' | 'POST'>

const CURRENT_USER_RESPONSE = {
  avatarUrl: null,
  createdAt: '2026-08-21T10:15:00.000Z',
  email: 'user@example.com',
  emailVerified: true,
  id: 7,
  loginMethods: ['password'] as const,
  username: 'UserName',
}

const createApiClient = ({
  getMock = vi.fn().mockResolvedValue({
    data: CURRENT_USER_RESPONSE,
    response: new Response(null, { status: 200 }),
  }),
  postMock,
}: {
  getMock?: ReturnType<typeof vi.fn>
  postMock: ReturnType<typeof vi.fn>
}) => ({ GET: getMock, POST: postMock }) as unknown as SessionApiClient

describe('createRefreshSession', () => {
  afterEach(() => {
    clearCurrentUserLoadFailure()
    sessionStore.setState({ accessToken: null, currentUser: null, status: 'loading' })
    vi.restoreAllMocks()
  })

  it('requests and stores an access token', async () => {
    const postMock = vi.fn().mockResolvedValue({
      data: { accessToken: 'new-token' },
      response: new Response(null, { status: 200 }),
    })
    const getMock = vi.fn().mockResolvedValue({
      data: CURRENT_USER_RESPONSE,
      response: new Response(null, { status: 200 }),
    })
    const refreshSession = createRefreshSession(createApiClient({ getMock, postMock }))

    await expect(refreshSession()).resolves.toBe('new-token')
    expect(postMock).toHaveBeenCalledWith('/api/v1/auth/refresh-token')
    expect(getMock).toHaveBeenCalledWith('/api/v1/auth/me')
    expect(sessionStore.getState()).toMatchObject({
      accessToken: 'new-token',
      currentUser: {
        avatarUrl: null,
        email: 'user@example.com',
        id: '7',
        username: 'UserName',
      },
      status: 'authenticated',
    })
  })

  it('shares one refresh request between concurrent callers', async () => {
    let resolveRefresh: ((value: unknown) => void) | undefined
    const refreshResponse = new Promise((resolve) => {
      resolveRefresh = resolve
    })
    const postMock = vi.fn().mockReturnValue(refreshResponse)
    const refreshSession = createRefreshSession(createApiClient({ postMock }))

    const firstRefresh = refreshSession()
    const secondRefresh = refreshSession()

    resolveRefresh?.({
      data: { accessToken: 'shared-token' },
      response: new Response(null, { status: 200 }),
    })

    await expect(Promise.all([firstRefresh, secondRefresh])).resolves.toEqual([
      'shared-token',
      'shared-token',
    ])
    expect(postMock).toHaveBeenCalledOnce()
  })

  it('clears the session when refresh fails', async () => {
    const postMock = vi.fn().mockResolvedValue({
      error: { message: 'Unauthorized' },
      response: new Response(null, { status: 401 }),
    })
    const refreshSession = createRefreshSession(createApiClient({ postMock }))

    await expect(refreshSession()).resolves.toBeNull()
    expect(sessionStore.getState()).toMatchObject({
      accessToken: null,
      currentUser: null,
      status: 'guest',
    })
  })

  it('clears the session when current user loading fails after refresh', async () => {
    const postMock = vi.fn().mockResolvedValue({
      data: { accessToken: 'new-token' },
      response: new Response(null, { status: 200 }),
    })
    const getMock = vi.fn().mockResolvedValue({
      data: undefined,
      response: new Response(null, { status: 401 }),
    })
    const refreshSession = createRefreshSession(createApiClient({ getMock, postMock }))

    await expect(refreshSession()).resolves.toBeNull()
    expect(sessionStore.getState()).toMatchObject({
      accessToken: null,
      currentUser: null,
      status: 'guest',
    })
  })

  it('preserves the refreshed access token when current user loading fails with a server error', async () => {
    const postMock = vi.fn().mockResolvedValue({
      data: { accessToken: 'new-token' },
      response: new Response(null, { status: 200 }),
    })
    const getMock = vi.fn().mockResolvedValue({
      data: undefined,
      response: new Response(null, { status: 500 }),
    })
    const refreshSession = createRefreshSession(createApiClient({ getMock, postMock }))

    await expect(refreshSession()).resolves.toBeNull()
    expect(hasRecentCurrentUserLoadFailure()).toBe(true)
    expect(sessionStore.getState()).toMatchObject({
      accessToken: 'new-token',
      currentUser: null,
      status: 'authenticated',
    })
  })
})

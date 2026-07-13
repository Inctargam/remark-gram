import type { Client } from 'openapi-fetch'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { paths } from '@/shared/api/openapi/schema'

import { createRefreshSession } from './refreshSession'
import { sessionStore } from './sessionStore'

type SessionApiClient = Pick<Client<paths>, 'POST'>

const createApiClient = (postMock: ReturnType<typeof vi.fn>) =>
  ({ POST: postMock }) as unknown as SessionApiClient

describe('createRefreshSession', () => {
  afterEach(() => {
    sessionStore.setState({ accessToken: null, status: 'loading' })
    vi.restoreAllMocks()
  })

  it('requests and stores an access token', async () => {
    const postMock = vi.fn().mockResolvedValue({
      data: { accessToken: 'new-token' },
      response: new Response(null, { status: 200 }),
    })
    const refreshSession = createRefreshSession(createApiClient(postMock))

    await expect(refreshSession()).resolves.toBe('new-token')
    expect(postMock).toHaveBeenCalledWith('/api/v1/auth/refresh-token')
    expect(sessionStore.getState()).toMatchObject({
      accessToken: 'new-token',
      status: 'authenticated',
    })
  })

  it('shares one refresh request between concurrent callers', async () => {
    let resolveRefresh: ((value: unknown) => void) | undefined
    const refreshResponse = new Promise((resolve) => {
      resolveRefresh = resolve
    })
    const postMock = vi.fn().mockReturnValue(refreshResponse)
    const refreshSession = createRefreshSession(createApiClient(postMock))

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
    const refreshSession = createRefreshSession(createApiClient(postMock))

    await expect(refreshSession()).resolves.toBeNull()
    expect(sessionStore.getState()).toMatchObject({ accessToken: null, status: 'guest' })
  })
})

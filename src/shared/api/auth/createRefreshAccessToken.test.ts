import type { Client } from 'openapi-fetch'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { paths } from '@/shared/api/openapi/schema'
import { sessionStore } from '@/shared/auth'

import { createRefreshAccessToken } from './createRefreshAccessToken'

type ApiClient = Pick<Client<paths>, 'POST'>

const createApiClient = (postMock: ReturnType<typeof vi.fn>) =>
  ({ POST: postMock }) as unknown as ApiClient

describe('createRefreshAccessToken', () => {
  afterEach(() => {
    sessionStore.setState({ accessToken: null, status: 'loading' })
    vi.restoreAllMocks()
  })

  it('requests a token without the auth pipeline and stores it', async () => {
    const postMock = vi.fn().mockResolvedValue({
      data: { accessToken: 'new-token' },
      response: new Response(null, { status: 200 }),
    })
    const refreshAccessToken = createRefreshAccessToken(createApiClient(postMock))

    await expect(refreshAccessToken()).resolves.toBe('new-token')
    expect(postMock).toHaveBeenCalledWith('/api/v1/auth/refresh-token', { auth: false })
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
    const refreshAccessToken = createRefreshAccessToken(createApiClient(postMock))

    const firstRefresh = refreshAccessToken()
    const secondRefresh = refreshAccessToken()

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
    const refreshAccessToken = createRefreshAccessToken(createApiClient(postMock))

    await expect(refreshAccessToken()).resolves.toBeNull()
    expect(sessionStore.getState()).toMatchObject({ accessToken: null, status: 'guest' })
  })
})

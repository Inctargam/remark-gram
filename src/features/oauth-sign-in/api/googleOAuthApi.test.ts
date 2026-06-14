import { afterEach, describe, expect, it, vi } from 'vitest'

import { OAUTH_CONFIG } from '@/shared/config'

import { signInWithGoogleCode } from './googleOAuthApi'

const createJsonResponse = (payload: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: init?.status ?? 200,
    statusText: init?.statusText,
  })

describe('signInWithGoogleCode', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sends google code and state to the exchange endpoint', async () => {
    const result = {
      status: 'authenticated',
      user: {
        id: 'google-user-id',
        email: 'user@gmail.com',
        username: 'googleUser',
        providers: ['google'],
      },
    }
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createJsonResponse(result))

    await expect(
      signInWithGoogleCode({
        code: 'google-code',
        state: 'google-state',
      })
    ).resolves.toEqual(result)

    expect(fetchMock).toHaveBeenCalledWith(OAUTH_CONFIG.googleMockExchangeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: 'google-code',
        state: 'google-state',
      }),
    })
  })

  it('throws backend error message when exchange endpoint rejects the request', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      createJsonResponse({ message: 'Google OAuth state is invalid.' }, { status: 400 })
    )

    await expect(signInWithGoogleCode({ code: 'google-code' })).rejects.toThrow(
      'Google OAuth state is invalid.'
    )
  })

  it('throws fallback error when exchange endpoint rejects with non-json response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Internal Server Error', { status: 500 })
    )

    await expect(signInWithGoogleCode({ code: 'google-code' })).rejects.toThrow(
      'Google OAuth sign in failed.'
    )
  })
})

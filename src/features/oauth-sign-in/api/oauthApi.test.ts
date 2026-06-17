import { afterEach, describe, expect, it, vi } from 'vitest'

import { OAUTH_CONFIG } from '@/shared/config'

import { exchangeOAuthCode } from './oauthApi'

const createJsonResponse = (payload: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: init?.status ?? 200,
    statusText: init?.statusText,
  })

describe('exchangeOAuthCode', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    ['google' as const, OAUTH_CONFIG.googleMockExchangeEndpoint],
    ['github' as const, OAUTH_CONFIG.githubMockExchangeEndpoint],
  ])('sends %s code and state to the provider exchange endpoint', async (provider, endpoint) => {
    const result = {
      status: 'authenticated',
      user: {
        id: `${provider}-user-id`,
        email: `user@${provider}.example`,
        username: `${provider}User`,
        providers: [provider],
      },
    }
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createJsonResponse(result))

    await expect(
      exchangeOAuthCode(provider, {
        code: `${provider}-code`,
        state: `${provider}-state`,
      })
    ).resolves.toEqual(result)

    expect(fetchMock).toHaveBeenCalledWith(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: `${provider}-code`,
        state: `${provider}-state`,
      }),
    })
  })

  it('throws backend error message when exchange endpoint rejects the request', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      createJsonResponse({ message: 'OAuth state is invalid.' }, { status: 400 })
    )

    await expect(exchangeOAuthCode('github', { code: 'github-code' })).rejects.toThrow(
      'OAuth state is invalid.'
    )
  })

  it('throws provider fallback error when exchange endpoint rejects with non-json response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Internal Server Error', { status: 500 })
    )

    await expect(exchangeOAuthCode('google', { code: 'google-code' })).rejects.toThrow(
      'Google OAuth sign in failed.'
    )
  })
})

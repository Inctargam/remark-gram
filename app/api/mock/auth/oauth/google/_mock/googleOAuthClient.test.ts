import { afterEach, describe, expect, it, vi } from 'vitest'

import { GOOGLE_OAUTH_CONFIG } from './config'
import { createGoogleOAuthAuthorizationUrl, exchangeRealGoogleOAuthCode } from './googleOAuthClient'

const createJsonResponse = (payload: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: init?.status ?? 200,
    statusText: init?.statusText,
  })

describe('createGoogleOAuthAuthorizationUrl', () => {
  it('creates google authorization URL with required OAuth params', () => {
    const authorizationUrl = createGoogleOAuthAuthorizationUrl('google-state')

    expect(authorizationUrl.origin + authorizationUrl.pathname).toBe(
      GOOGLE_OAUTH_CONFIG.authorizationEndpoint
    )
    expect(authorizationUrl.searchParams.get('client_id')).toBe(GOOGLE_OAUTH_CONFIG.clientId)
    expect(authorizationUrl.searchParams.get('redirect_uri')).toBe(GOOGLE_OAUTH_CONFIG.redirectUri)
    expect(authorizationUrl.searchParams.get('response_type')).toBe('code')
    expect(authorizationUrl.searchParams.get('scope')).toBe(GOOGLE_OAUTH_CONFIG.scope)
    expect(authorizationUrl.searchParams.get('state')).toBe('google-state')
  })
})

describe('exchangeRealGoogleOAuthCode', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exchanges google code and returns user info', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ access_token: 'google-access-token' }))
      .mockResolvedValueOnce(
        createJsonResponse({
          sub: 'google-user-id',
          email: 'user@gmail.com',
          name: 'Google User',
        })
      )

    await expect(exchangeRealGoogleOAuthCode('real-google-code')).resolves.toEqual({
      status: 'authenticated',
      user: {
        id: 'google-user-id',
        email: 'user@gmail.com',
        username: 'GoogleUser',
        providers: ['google'],
      },
    })

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      GOOGLE_OAUTH_CONFIG.tokenEndpoint,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      GOOGLE_OAUTH_CONFIG.userInfoEndpoint,
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer google-access-token',
        },
      })
    )
  })

  it('throws when token response does not include access token', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(createJsonResponse({}))

    await expect(exchangeRealGoogleOAuthCode('real-google-code')).rejects.toThrow(
      'Google OAuth access token was not returned.'
    )
  })

  it('throws when profile is incomplete', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ access_token: 'google-access-token' }))
      .mockResolvedValueOnce(
        createJsonResponse({
          sub: 'google-user-id',
        })
      )

    await expect(exchangeRealGoogleOAuthCode('real-google-code')).rejects.toThrow(
      'Google OAuth profile is incomplete.'
    )
  })
})

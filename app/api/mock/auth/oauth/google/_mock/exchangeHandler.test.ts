import { describe, expect, it } from 'vitest'

import { GOOGLE_OAUTH_CONFIG } from './config'
import { exchangeGoogleOAuthCodeHandler } from './exchangeHandler'
import { createGoogleOAuthMockStateCookie } from './stateCookie'

const createExchangeRequest = (payload: unknown, stateCookie?: string) =>
  new Request('https://dev.remarkgram.com:3000/api/mock/auth/oauth/google/exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(stateCookie ? { cookie: createGoogleOAuthMockStateCookie(stateCookie) } : {}),
    },
    body: JSON.stringify(payload),
  })

const getSetCookieHeader = (response: Response) => response.headers.get('set-cookie') ?? ''

describe('exchangeGoogleOAuthCodeHandler', () => {
  it('rejects request without google authorization code', async () => {
    const response = await exchangeGoogleOAuthCodeHandler(
      createExchangeRequest({ state: 'google-state' }, 'google-state')
    )

    await expect(response.json()).resolves.toEqual({ message: 'Google OAuth code is required.' })
    expect(response.status).toBe(400)
  })

  it('rejects request without matching state cookie', async () => {
    const response = await exchangeGoogleOAuthCodeHandler(
      createExchangeRequest(
        {
          code: GOOGLE_OAUTH_CONFIG.mockAuthorizationCode,
          state: 'actual-state',
        },
        'expected-state'
      )
    )

    await expect(response.json()).resolves.toEqual({ message: 'Google OAuth state is invalid.' })
    expect(response.status).toBe(400)
  })

  it('sets session cookies and clears state cookie after successful exchange', async () => {
    const response = await exchangeGoogleOAuthCodeHandler(
      createExchangeRequest(
        {
          code: GOOGLE_OAUTH_CONFIG.mockAuthorizationCode,
          state: 'google-state',
        },
        'google-state'
      )
    )

    await expect(response.json()).resolves.toEqual({
      status: 'registered',
      user: {
        id: 'mock-google-user-1',
        email: 'new.user@gmail.com',
        username: 'client1',
        providers: ['google'],
      },
    })
    expect(response.status).toBe(200)
    expect(getSetCookieHeader(response)).toContain('accessToken=mock-access-token')
    expect(getSetCookieHeader(response)).toContain('refreshToken=mock-refresh-token')
    expect(getSetCookieHeader(response)).toContain(`${GOOGLE_OAUTH_CONFIG.stateCookieName}=`)
    expect(getSetCookieHeader(response)).toContain('Max-Age=0')
  })

  it('returns server error when mock exchange scenario fails', async () => {
    const response = await exchangeGoogleOAuthCodeHandler(
      createExchangeRequest(
        {
          code: GOOGLE_OAUTH_CONFIG.mockAuthorizationCode,
          scenario: 'error',
          state: 'google-state',
        },
        'google-state'
      )
    )

    await expect(response.json()).resolves.toEqual({
      message: 'Google OAuth mock exchange failed.',
    })
    expect(response.status).toBe(500)
    expect(getSetCookieHeader(response)).toBe('')
  })
})

import { describe, expect, it } from 'vitest'

import { GITHUB_OAUTH_CONFIG } from './config'
import { exchangeGitHubOAuthCodeHandler } from './exchangeHandler'
import { createGitHubOAuthMockStateCookie } from './stateCookie'

const createExchangeRequest = (payload: unknown, stateCookie?: string) =>
  new Request('https://dev.remarkgram.com:3000/api/mock/auth/oauth/github/exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(stateCookie ? { cookie: createGitHubOAuthMockStateCookie(stateCookie) } : {}),
    },
    body: JSON.stringify(payload),
  })

const getSetCookieHeader = (response: Response) => response.headers.get('set-cookie') ?? ''

describe('exchangeGitHubOAuthCodeHandler', () => {
  it('rejects request without github authorization code', async () => {
    const response = await exchangeGitHubOAuthCodeHandler(
      createExchangeRequest({ state: 'github-state' }, 'github-state')
    )

    await expect(response.json()).resolves.toEqual({ message: 'GitHub OAuth code is required.' })
    expect(response.status).toBe(400)
  })

  it('rejects request without matching state cookie', async () => {
    const response = await exchangeGitHubOAuthCodeHandler(
      createExchangeRequest(
        {
          code: GITHUB_OAUTH_CONFIG.mockAuthorizationCode,
          state: 'actual-state',
        },
        'expected-state'
      )
    )

    await expect(response.json()).resolves.toEqual({ message: 'GitHub OAuth state is invalid.' })
    expect(response.status).toBe(400)
  })

  it('sets session cookies and clears state cookie after successful exchange', async () => {
    const response = await exchangeGitHubOAuthCodeHandler(
      createExchangeRequest(
        {
          code: GITHUB_OAUTH_CONFIG.mockAuthorizationCode,
          state: 'github-state',
        },
        'github-state'
      )
    )

    await expect(response.json()).resolves.toEqual({
      status: 'registered',
      user: {
        id: 'mock-github-user-1',
        email: 'new.user@github.example',
        username: 'githubClient1',
        providers: ['github'],
      },
    })
    expect(response.status).toBe(200)
    expect(getSetCookieHeader(response)).toContain('accessToken=mock-access-token')
    expect(getSetCookieHeader(response)).toContain('refreshToken=mock-refresh-token')
    expect(getSetCookieHeader(response)).toContain(`${GITHUB_OAUTH_CONFIG.stateCookieName}=`)
    expect(getSetCookieHeader(response)).toContain('Max-Age=0')
  })

  it('returns server error when mock exchange scenario fails', async () => {
    const response = await exchangeGitHubOAuthCodeHandler(
      createExchangeRequest(
        {
          code: GITHUB_OAUTH_CONFIG.mockAuthorizationCode,
          scenario: 'error',
          state: 'github-state',
        },
        'github-state'
      )
    )

    await expect(response.json()).resolves.toEqual({
      message: 'GitHub OAuth mock exchange failed.',
    })
    expect(response.status).toBe(500)
    expect(getSetCookieHeader(response)).toBe('')
  })
})

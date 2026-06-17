import { afterEach, describe, expect, it, vi } from 'vitest'

import { GITHUB_OAUTH_CONFIG } from './config'
import { createGitHubOAuthAuthorizationUrl, exchangeRealGitHubOAuthCode } from './githubOAuthClient'

const createJsonResponse = (payload: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: init?.status ?? 200,
    statusText: init?.statusText,
  })

describe('createGitHubOAuthAuthorizationUrl', () => {
  it('creates github authorization URL with required OAuth params', () => {
    const authorizationUrl = createGitHubOAuthAuthorizationUrl('github-state')

    expect(authorizationUrl.origin + authorizationUrl.pathname).toBe(
      GITHUB_OAUTH_CONFIG.authorizationEndpoint
    )
    expect(authorizationUrl.searchParams.get('client_id')).toBe(GITHUB_OAUTH_CONFIG.clientId)
    expect(authorizationUrl.searchParams.get('redirect_uri')).toBe(GITHUB_OAUTH_CONFIG.redirectUri)
    expect(authorizationUrl.searchParams.get('scope')).toBe(GITHUB_OAUTH_CONFIG.scope)
    expect(authorizationUrl.searchParams.get('state')).toBe('github-state')
  })
})

describe('exchangeRealGitHubOAuthCode', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exchanges github code and returns profile email when it is public', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ access_token: 'github-access-token' }))
      .mockResolvedValueOnce(
        createJsonResponse({
          id: 123,
          email: 'public@github.example',
          login: 'githubLogin',
        })
      )

    await expect(exchangeRealGitHubOAuthCode('real-github-code')).resolves.toEqual({
      status: 'authenticated',
      user: {
        id: '123',
        email: 'public@github.example',
        username: 'githubLogin',
        providers: ['github'],
      },
    })

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      GITHUB_OAUTH_CONFIG.tokenEndpoint,
      expect.objectContaining({
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      GITHUB_OAUTH_CONFIG.userEndpoint,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer github-access-token',
        }),
      })
    )
  })

  it('requests primary verified email when github profile email is private', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ access_token: 'github-access-token' }))
      .mockResolvedValueOnce(
        createJsonResponse({
          id: 123,
          email: null,
          login: 'githubLogin',
        })
      )
      .mockResolvedValueOnce(
        createJsonResponse([
          {
            email: 'secondary@github.example',
            primary: false,
            verified: true,
          },
          {
            email: 'primary@github.example',
            primary: true,
            verified: true,
          },
        ])
      )

    await expect(exchangeRealGitHubOAuthCode('real-github-code')).resolves.toEqual({
      status: 'authenticated',
      user: {
        id: '123',
        email: 'primary@github.example',
        username: 'githubLogin',
        providers: ['github'],
      },
    })

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      GITHUB_OAUTH_CONFIG.emailsEndpoint,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer github-access-token',
        }),
      })
    )
  })

  it('throws when token response does not include access token', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(createJsonResponse({}))

    await expect(exchangeRealGitHubOAuthCode('real-github-code')).rejects.toThrow(
      'GitHub OAuth access token was not returned.'
    )
  })

  it('throws when no profile or primary verified email is returned', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ access_token: 'github-access-token' }))
      .mockResolvedValueOnce(
        createJsonResponse({
          id: 123,
          email: null,
          login: 'githubLogin',
        })
      )
      .mockResolvedValueOnce(
        createJsonResponse([
          {
            email: 'private@github.example',
            primary: true,
            verified: false,
          },
        ])
      )

    await expect(exchangeRealGitHubOAuthCode('real-github-code')).rejects.toThrow(
      'GitHub OAuth email was not returned.'
    )
  })
})

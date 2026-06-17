import { describe, expect, it } from 'vitest'

import { GITHUB_OAUTH_CONFIG } from './config'
import {
  clearGitHubOAuthMockStateCookie,
  createGitHubOAuthMockStateCookie,
  isGitHubOAuthMockStateValid,
} from './stateCookie'

const createRequestWithCookie = (cookie: string) =>
  new Request('https://dev.remarkgram.com:3000/api/mock/auth/oauth/github/exchange', {
    headers: {
      cookie,
    },
  })

describe('github oauth state cookie', () => {
  it('creates a short lived http-only state cookie', () => {
    const cookie = createGitHubOAuthMockStateCookie('github-state')

    expect(cookie).toContain(`${GITHUB_OAUTH_CONFIG.stateCookieName}=github-state`)
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('Path=/')
    expect(cookie).toContain('SameSite=Lax')
    expect(cookie).toContain('Max-Age=600')
  })

  it('validates matching state from request cookie', () => {
    const request = createRequestWithCookie(createGitHubOAuthMockStateCookie('github-state'))

    expect(isGitHubOAuthMockStateValid(request, 'github-state')).toBe(true)
  })

  it('rejects missing callback state', () => {
    const request = createRequestWithCookie(createGitHubOAuthMockStateCookie('github-state'))

    expect(isGitHubOAuthMockStateValid(request, undefined)).toBe(false)
  })

  it('rejects state that does not match request cookie', () => {
    const request = createRequestWithCookie(createGitHubOAuthMockStateCookie('expected-state'))

    expect(isGitHubOAuthMockStateValid(request, 'actual-state')).toBe(false)
  })

  it('rejects request without state cookie', () => {
    const request = new Request(
      'https://dev.remarkgram.com:3000/api/mock/auth/oauth/github/exchange'
    )

    expect(isGitHubOAuthMockStateValid(request, 'github-state')).toBe(false)
  })

  it('creates a cookie header that clears the state cookie', () => {
    expect(clearGitHubOAuthMockStateCookie).toContain(`${GITHUB_OAUTH_CONFIG.stateCookieName}=`)
    expect(clearGitHubOAuthMockStateCookie).toContain('HttpOnly')
    expect(clearGitHubOAuthMockStateCookie).toContain('Path=/')
    expect(clearGitHubOAuthMockStateCookie).toContain('SameSite=Lax')
    expect(clearGitHubOAuthMockStateCookie).toContain('Max-Age=0')
  })
})

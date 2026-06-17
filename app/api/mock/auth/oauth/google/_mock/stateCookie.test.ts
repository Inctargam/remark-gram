import { describe, expect, it } from 'vitest'

import { GOOGLE_OAUTH_CONFIG } from './config'
import {
  clearGoogleOAuthMockStateCookie,
  createGoogleOAuthMockStateCookie,
  isGoogleOAuthMockStateValid,
} from './stateCookie'

const createRequestWithCookie = (cookie: string) =>
  new Request('https://dev.remarkgram.com:3000/api/mock/auth/oauth/google/exchange', {
    headers: {
      cookie,
    },
  })

describe('google oauth state cookie', () => {
  it('creates a short lived http-only state cookie', () => {
    const cookie = createGoogleOAuthMockStateCookie('google-state')

    expect(cookie).toContain(`${GOOGLE_OAUTH_CONFIG.stateCookieName}=google-state`)
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('Path=/')
    expect(cookie).toContain('SameSite=Lax')
    expect(cookie).toContain('Max-Age=600')
  })

  it('validates matching state from request cookie', () => {
    const request = createRequestWithCookie(createGoogleOAuthMockStateCookie('google-state'))

    expect(isGoogleOAuthMockStateValid(request, 'google-state')).toBe(true)
  })

  it('rejects missing callback state', () => {
    const request = createRequestWithCookie(createGoogleOAuthMockStateCookie('google-state'))

    expect(isGoogleOAuthMockStateValid(request, undefined)).toBe(false)
  })

  it('rejects state that does not match request cookie', () => {
    const request = createRequestWithCookie(createGoogleOAuthMockStateCookie('expected-state'))

    expect(isGoogleOAuthMockStateValid(request, 'actual-state')).toBe(false)
  })

  it('rejects request without state cookie', () => {
    const request = new Request(
      'https://dev.remarkgram.com:3000/api/mock/auth/oauth/google/exchange'
    )

    expect(isGoogleOAuthMockStateValid(request, 'google-state')).toBe(false)
  })

  it('creates a cookie header that clears the state cookie', () => {
    expect(clearGoogleOAuthMockStateCookie).toContain(`${GOOGLE_OAUTH_CONFIG.stateCookieName}=`)
    expect(clearGoogleOAuthMockStateCookie).toContain('HttpOnly')
    expect(clearGoogleOAuthMockStateCookie).toContain('Path=/')
    expect(clearGoogleOAuthMockStateCookie).toContain('SameSite=Lax')
    expect(clearGoogleOAuthMockStateCookie).toContain('Max-Age=0')
  })
})

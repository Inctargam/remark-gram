import { describe, expect, it } from 'vitest'

import { API_BASE_URL } from '@/shared/config'

import { OAUTH_AUTHORIZE_URLS } from './oauthAuthorizeUrls'

describe('OAUTH_AUTHORIZE_URLS', () => {
  it.each([
    ['google' as const, '/api/v1/auth/google'],
    ['github' as const, '/api/v1/auth/github'],
  ])('contains the %s backend authorize URL', (provider, path) => {
    expect(OAUTH_AUTHORIZE_URLS[provider]).toBe(`${API_BASE_URL}${path}`)
  })
})

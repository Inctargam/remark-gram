import { describe, expect, it } from 'vitest'

import { OAUTH_CONFIG } from '@/shared/config'

import { getOAuthAuthorizeEndpoint } from './getOAuthAuthorizeEndpoint'

describe('getOAuthAuthorizeEndpoint', () => {
  it.each([
    ['google' as const, OAUTH_CONFIG.googleMockAuthorizeEndpoint],
    ['github' as const, OAUTH_CONFIG.githubMockAuthorizeEndpoint],
  ])('returns %s authorize endpoint', (provider, endpoint) => {
    expect(getOAuthAuthorizeEndpoint(provider)).toBe(endpoint)
  })
})

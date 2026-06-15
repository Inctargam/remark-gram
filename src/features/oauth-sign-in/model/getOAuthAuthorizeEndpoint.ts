import { OAUTH_CONFIG } from '@/shared/config'

import type { OAuthProvider } from './types'

const OAUTH_AUTHORIZE_ENDPOINTS = {
  github: OAUTH_CONFIG.githubMockAuthorizeEndpoint,
  google: OAUTH_CONFIG.googleMockAuthorizeEndpoint,
} as const

export const getOAuthAuthorizeEndpoint = (provider: OAuthProvider) => {
  return OAUTH_AUTHORIZE_ENDPOINTS[provider]
}

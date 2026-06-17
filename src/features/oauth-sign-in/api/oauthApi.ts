import { OAUTH_CONFIG } from '@/shared/config'

import type { OAuthExchangePayload, OAuthExchangeResult, OAuthProvider } from '../model/types'

const OAUTH_EXCHANGE_ENDPOINTS = {
  github: OAUTH_CONFIG.githubMockExchangeEndpoint,
  google: OAUTH_CONFIG.googleMockExchangeEndpoint,
} as const

const PROVIDER_ERROR_MESSAGES = {
  github: 'GitHub OAuth sign in failed.',
  google: 'Google OAuth sign in failed.',
} as const

export const exchangeOAuthCode = async (
  provider: OAuthProvider,
  payload: OAuthExchangePayload
): Promise<OAuthExchangeResult> => {
  const response = await fetch(OAUTH_EXCHANGE_ENDPOINTS[provider], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as { message?: string } | null

    throw new Error(errorPayload?.message ?? PROVIDER_ERROR_MESSAGES[provider])
  }

  return (await response.json()) as OAuthExchangeResult
}

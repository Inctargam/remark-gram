import { GOOGLE_OAUTH_CONFIG } from './config'
import { exchangeRealGoogleOAuthCode } from './googleOAuthClient'
import {
  delayGoogleOAuthMockResponse,
  GOOGLE_EXISTING_USER_RESULT,
  GOOGLE_NEW_USER_RESULT,
  isGoogleOAuthMockScenario,
} from './mockScenarios'
import type { GoogleOAuthMockRequest, GoogleOAuthMockResult } from './types'

export const parseGoogleOAuthMockRequest = async (
  request: Request
): Promise<GoogleOAuthMockRequest | null> => {
  return request.json().catch(() => null) as Promise<GoogleOAuthMockRequest | null>
}

export const exchangeGoogleOAuthMockCode = async ({
  code,
  scenario,
}: GoogleOAuthMockRequest): Promise<GoogleOAuthMockResult> => {
  await delayGoogleOAuthMockResponse()

  const mockScenario = isGoogleOAuthMockScenario(scenario) ? scenario : 'new-user'

  if (mockScenario === 'error') {
    throw new Error('Google OAuth mock exchange failed.')
  }

  if (mockScenario === 'existing-user') {
    return GOOGLE_EXISTING_USER_RESULT
  }

  if (code && code !== GOOGLE_OAUTH_CONFIG.mockAuthorizationCode) {
    return exchangeRealGoogleOAuthCode(code)
  }

  return GOOGLE_NEW_USER_RESULT
}

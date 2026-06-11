import { OAUTH_CONFIG } from '@/shared/config'

import type { GoogleOAuthSignInPayload, GoogleOAuthSignInResult } from '../model/types'

export const signInWithGoogleCode = async (
  payload: GoogleOAuthSignInPayload
): Promise<GoogleOAuthSignInResult> => {
  const response = await fetch(OAUTH_CONFIG.googleMockExchangeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as { message?: string } | null

    throw new Error(errorPayload?.message ?? 'Google OAuth sign in failed.')
  }

  return response.json() as Promise<GoogleOAuthSignInResult>
}

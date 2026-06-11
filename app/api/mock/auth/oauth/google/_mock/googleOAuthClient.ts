import { GOOGLE_OAUTH_CONFIG } from './config'
import type { GoogleOAuthMockResult } from './types'

type GoogleOAuthTokenResponse = {
  access_token?: string
}

type GoogleOAuthUserInfoResponse = {
  sub?: string
  email?: string
  name?: string
}

const getUsernameFromGoogleProfile = ({ email, name }: GoogleOAuthUserInfoResponse) => {
  if (name) {
    return name.replace(/\s+/g, '')
  }

  return email?.split('@')[0] ?? 'googleUser'
}

export const createGoogleOAuthAuthorizationUrl = (state: string) => {
  const authorizationUrl = new URL(GOOGLE_OAUTH_CONFIG.authorizationEndpoint)

  authorizationUrl.searchParams.set('client_id', GOOGLE_OAUTH_CONFIG.clientId)
  authorizationUrl.searchParams.set('redirect_uri', GOOGLE_OAUTH_CONFIG.redirectUri)
  authorizationUrl.searchParams.set('response_type', 'code')
  authorizationUrl.searchParams.set('scope', GOOGLE_OAUTH_CONFIG.scope)
  authorizationUrl.searchParams.set('state', state)

  return authorizationUrl
}

export const exchangeRealGoogleOAuthCode = async (code: string): Promise<GoogleOAuthMockResult> => {
  const tokenPayload = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    client_secret: GOOGLE_OAUTH_CONFIG.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
  })

  const tokenResponse = await fetch(GOOGLE_OAUTH_CONFIG.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenPayload,
  })

  if (!tokenResponse.ok) {
    throw new Error('Google OAuth token exchange failed.')
  }

  const tokenPayloadResponse = (await tokenResponse.json()) as GoogleOAuthTokenResponse

  if (!tokenPayloadResponse.access_token) {
    throw new Error('Google OAuth access token was not returned.')
  }

  const userInfoResponse = await fetch(GOOGLE_OAUTH_CONFIG.userInfoEndpoint, {
    headers: {
      Authorization: `Bearer ${tokenPayloadResponse.access_token}`,
    },
  })

  if (!userInfoResponse.ok) {
    throw new Error('Google OAuth user info request failed.')
  }

  const googleProfile = (await userInfoResponse.json()) as GoogleOAuthUserInfoResponse

  if (!googleProfile.sub || !googleProfile.email) {
    throw new Error('Google OAuth profile is incomplete.')
  }

  return {
    status: 'authenticated',
    user: {
      id: googleProfile.sub,
      email: googleProfile.email,
      username: getUsernameFromGoogleProfile(googleProfile),
      providers: ['google'],
    },
  }
}

export const GOOGLE_OAUTH_CONFIG = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '',
  mockAuthorizationCode: 'mock-google-authorization-code',
  redirectUri: 'https://dev.remarkgram.com:3000/auth/google/callback',
  scope: 'openid email profile',
  stateCookieName: 'googleOAuthState',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userInfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
} as const

export const MOCK_DELAY_MS = 500

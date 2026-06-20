export const GITHUB_OAUTH_CONFIG = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  clientId: process.env.GITHUB_OAUTH_CLIENT_ID ?? '',
  clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET ?? '',
  emailsEndpoint: 'https://api.github.com/user/emails',
  mockAuthorizationCode: 'mock-github-authorization-code',
  redirectUri: 'https://dev.remarkgram.com:3000/auth/github/callback',
  scope: 'read:user user:email',
  stateCookieName: 'githubOAuthState',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  userEndpoint: 'https://api.github.com/user',
} as const

export const MOCK_DELAY_MS = 500

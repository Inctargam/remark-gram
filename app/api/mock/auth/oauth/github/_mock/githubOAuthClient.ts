import { GITHUB_OAUTH_CONFIG } from './config'
import type { GitHubOAuthMockResult } from './types'

type GitHubOAuthTokenResponse = {
  access_token?: string
}

type GitHubOAuthUserResponse = {
  id?: number
  email?: string | null
  login?: string
  name?: string | null
}

type GitHubOAuthEmailResponse = {
  email?: string
  primary?: boolean
  verified?: boolean
}

const GITHUB_API_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
} as const

const getUsernameFromGitHubProfile = ({ login, name }: GitHubOAuthUserResponse) => {
  if (login) {
    return login
  }

  if (name) {
    return name.replace(/\s+/g, '')
  }

  return 'githubUser'
}

const getPrimaryEmail = (emails: GitHubOAuthEmailResponse[]) => {
  return emails.find(({ primary, verified }) => primary && verified)?.email
}

export const createGitHubOAuthAuthorizationUrl = (state: string) => {
  const authorizationUrl = new URL(GITHUB_OAUTH_CONFIG.authorizationEndpoint)

  authorizationUrl.searchParams.set('client_id', GITHUB_OAUTH_CONFIG.clientId)
  authorizationUrl.searchParams.set('redirect_uri', GITHUB_OAUTH_CONFIG.redirectUri)
  authorizationUrl.searchParams.set('scope', GITHUB_OAUTH_CONFIG.scope)
  authorizationUrl.searchParams.set('state', state)

  return authorizationUrl
}

export const exchangeRealGitHubOAuthCode = async (code: string): Promise<GitHubOAuthMockResult> => {
  const tokenPayload = new URLSearchParams({
    client_id: GITHUB_OAUTH_CONFIG.clientId,
    client_secret: GITHUB_OAUTH_CONFIG.clientSecret,
    code,
    redirect_uri: GITHUB_OAUTH_CONFIG.redirectUri,
  })

  const tokenResponse = await fetch(GITHUB_OAUTH_CONFIG.tokenEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenPayload,
  })

  if (!tokenResponse.ok) {
    throw new Error('GitHub OAuth token exchange failed.')
  }

  const tokenPayloadResponse = (await tokenResponse.json()) as GitHubOAuthTokenResponse

  if (!tokenPayloadResponse.access_token) {
    throw new Error('GitHub OAuth access token was not returned.')
  }

  const authorizationHeader = `Bearer ${tokenPayloadResponse.access_token}`
  const userResponse = await fetch(GITHUB_OAUTH_CONFIG.userEndpoint, {
    headers: {
      ...GITHUB_API_HEADERS,
      Authorization: authorizationHeader,
    },
  })

  if (!userResponse.ok) {
    throw new Error('GitHub OAuth user request failed.')
  }

  const githubProfile = (await userResponse.json()) as GitHubOAuthUserResponse

  if (!githubProfile.id) {
    throw new Error('GitHub OAuth profile is incomplete.')
  }

  let email = githubProfile.email ?? null

  if (!email) {
    const emailsResponse = await fetch(GITHUB_OAUTH_CONFIG.emailsEndpoint, {
      headers: {
        ...GITHUB_API_HEADERS,
        Authorization: authorizationHeader,
      },
    })

    if (!emailsResponse.ok) {
      throw new Error('GitHub OAuth email request failed.')
    }

    const githubEmails = (await emailsResponse.json()) as GitHubOAuthEmailResponse[]

    email = getPrimaryEmail(githubEmails) ?? null
  }

  if (!email) {
    throw new Error('GitHub OAuth email was not returned.')
  }

  return {
    status: 'authenticated',
    user: {
      id: String(githubProfile.id),
      email,
      username: getUsernameFromGitHubProfile(githubProfile),
      providers: ['github'],
    },
  }
}

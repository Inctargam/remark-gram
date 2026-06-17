import { GITHUB_OAUTH_CONFIG } from './config'
import { exchangeRealGitHubOAuthCode } from './githubOAuthClient'
import {
  delayGitHubOAuthMockResponse,
  GITHUB_EXISTING_USER_RESULT,
  GITHUB_NEW_USER_RESULT,
  isGitHubOAuthMockScenario,
} from './mockScenarios'
import type { GitHubOAuthMockRequest, GitHubOAuthMockResult } from './types'

export const parseGitHubOAuthMockRequest = async (
  request: Request
): Promise<GitHubOAuthMockRequest | null> => {
  return request.json().catch(() => null) as Promise<GitHubOAuthMockRequest | null>
}

export const exchangeGitHubOAuthMockCode = async ({
  code,
  scenario,
}: GitHubOAuthMockRequest): Promise<GitHubOAuthMockResult> => {
  await delayGitHubOAuthMockResponse()

  const mockScenario = isGitHubOAuthMockScenario(scenario) ? scenario : 'new-user'

  if (mockScenario === 'error') {
    throw new Error('GitHub OAuth mock exchange failed.')
  }

  if (mockScenario === 'existing-user') {
    return GITHUB_EXISTING_USER_RESULT
  }

  if (code && code !== GITHUB_OAUTH_CONFIG.mockAuthorizationCode) {
    return exchangeRealGitHubOAuthCode(code)
  }

  return GITHUB_NEW_USER_RESULT
}

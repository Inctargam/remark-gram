import { createOAuthMockExchangeHandler } from '../../_mock/exchangeHandler'
import { exchangeGitHubOAuthMockCode, parseGitHubOAuthMockRequest } from './githubOAuthMock'
import { clearGitHubOAuthMockStateCookie, isGitHubOAuthMockStateValid } from './stateCookie'

export const exchangeGitHubOAuthCodeHandler = createOAuthMockExchangeHandler({
  clearStateCookie: clearGitHubOAuthMockStateCookie,
  exchangeCode: exchangeGitHubOAuthMockCode,
  invalidStateMessage: 'GitHub OAuth state is invalid.',
  isStateValid: isGitHubOAuthMockStateValid,
  missingCodeMessage: 'GitHub OAuth code is required.',
  parseRequest: parseGitHubOAuthMockRequest,
  serverErrorMessage: 'GitHub OAuth mock exchange failed.',
})

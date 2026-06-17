import {
  createClearOAuthMockStateCookie,
  createOAuthMockState,
  createOAuthMockStateCookie,
  isOAuthMockStateValid,
} from '../../_mock/stateCookie'
import { GITHUB_OAUTH_CONFIG } from './config'

export const createGitHubOAuthMockState = () => {
  return createOAuthMockState()
}

export const createGitHubOAuthMockStateCookie = (state: string) => {
  return createOAuthMockStateCookie(GITHUB_OAUTH_CONFIG.stateCookieName, state)
}

export const clearGitHubOAuthMockStateCookie = createClearOAuthMockStateCookie(
  GITHUB_OAUTH_CONFIG.stateCookieName
)

export const isGitHubOAuthMockStateValid = (request: Request, state: string | undefined) => {
  return isOAuthMockStateValid(request, GITHUB_OAUTH_CONFIG.stateCookieName, state)
}

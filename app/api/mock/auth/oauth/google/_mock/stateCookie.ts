import {
  createClearOAuthMockStateCookie,
  createOAuthMockState,
  createOAuthMockStateCookie,
  isOAuthMockStateValid,
} from '../../_mock/stateCookie'
import { GOOGLE_OAUTH_CONFIG } from './config'

export const createGoogleOAuthMockState = () => {
  return createOAuthMockState()
}

export const createGoogleOAuthMockStateCookie = (state: string) => {
  return createOAuthMockStateCookie(GOOGLE_OAUTH_CONFIG.stateCookieName, state)
}

export const clearGoogleOAuthMockStateCookie = createClearOAuthMockStateCookie(
  GOOGLE_OAUTH_CONFIG.stateCookieName
)

export const isGoogleOAuthMockStateValid = (request: Request, state: string | undefined) => {
  return isOAuthMockStateValid(request, GOOGLE_OAUTH_CONFIG.stateCookieName, state)
}

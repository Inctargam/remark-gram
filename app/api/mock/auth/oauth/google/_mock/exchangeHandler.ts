import { createOAuthMockExchangeHandler } from '../../_mock/exchangeHandler'
import { exchangeGoogleOAuthMockCode, parseGoogleOAuthMockRequest } from './googleOAuthMock'
import { clearGoogleOAuthMockStateCookie, isGoogleOAuthMockStateValid } from './stateCookie'

export const exchangeGoogleOAuthCodeHandler = createOAuthMockExchangeHandler({
  clearStateCookie: clearGoogleOAuthMockStateCookie,
  exchangeCode: exchangeGoogleOAuthMockCode,
  invalidStateMessage: 'Google OAuth state is invalid.',
  isStateValid: isGoogleOAuthMockStateValid,
  missingCodeMessage: 'Google OAuth code is required.',
  parseRequest: parseGoogleOAuthMockRequest,
  serverErrorMessage: 'Google OAuth mock exchange failed.',
})

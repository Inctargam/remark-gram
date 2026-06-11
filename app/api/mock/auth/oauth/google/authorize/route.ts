import { NextResponse } from 'next/server'

import { createGoogleOAuthAuthorizationUrl } from '../_mock/googleOAuthClient'
import { createGoogleOAuthMockState, createGoogleOAuthMockStateCookie } from '../_mock/stateCookie'

export const GET = () => {
  const state = createGoogleOAuthMockState()
  const authorizationUrl = createGoogleOAuthAuthorizationUrl(state)
  const response = NextResponse.redirect(authorizationUrl)

  response.headers.append('Set-Cookie', createGoogleOAuthMockStateCookie(state))

  return response
}

import { NextResponse } from 'next/server'

import { createGitHubOAuthAuthorizationUrl } from '../_mock/githubOAuthClient'
import { createGitHubOAuthMockState, createGitHubOAuthMockStateCookie } from '../_mock/stateCookie'

export const GET = () => {
  const state = createGitHubOAuthMockState()
  const authorizationUrl = createGitHubOAuthAuthorizationUrl(state)
  const response = NextResponse.redirect(authorizationUrl)

  response.headers.append('Set-Cookie', createGitHubOAuthMockStateCookie(state))

  return response
}

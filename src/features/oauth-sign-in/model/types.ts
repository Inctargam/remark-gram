export type AuthProvider = 'email' | 'google' | 'github'

export type OAuthProvider = Exclude<AuthProvider, 'email'>

export type OAuthMockScenario = 'new-user' | 'existing-user' | 'error'

export type GoogleOAuthSignInPayload = {
  code: string
  state?: string
  scenario?: OAuthMockScenario
}

export type OAuthExchangeStatus = 'registered' | 'linked' | 'authenticated'

export type OAuthUser = {
  id: string
  email: string
  username: string
  providers: AuthProvider[]
}

export type GoogleOAuthSignInResult = {
  status: OAuthExchangeStatus
  user: OAuthUser
}

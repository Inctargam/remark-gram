type MockAuthProvider = 'email' | 'google' | 'github'

type MockSessionUser = {
  id: string
  email: string
  username: string
  providers: MockAuthProvider[]
}

export type GoogleOAuthMockScenario = 'new-user' | 'existing-user' | 'error'

export type GoogleOAuthMockRequest = {
  code?: string
  state?: string
  scenario?: GoogleOAuthMockScenario
}

export type GoogleOAuthMockResult = {
  status: 'registered' | 'linked' | 'authenticated'
  user: MockSessionUser
}

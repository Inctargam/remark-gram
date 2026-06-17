type MockAuthProvider = 'email' | 'google' | 'github'

type MockSessionUser = {
  id: string
  email: string
  username: string
  providers: MockAuthProvider[]
}

export type GitHubOAuthMockScenario = 'new-user' | 'existing-user' | 'error'

export type GitHubOAuthMockRequest = {
  code?: string
  state?: string
  scenario?: GitHubOAuthMockScenario
}

export type GitHubOAuthMockResult = {
  status: 'registered' | 'linked' | 'authenticated'
  user: MockSessionUser
}

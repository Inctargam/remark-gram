import { MOCK_DELAY_MS } from './config'
import type { GitHubOAuthMockResult, GitHubOAuthMockScenario } from './types'

export const GITHUB_NEW_USER_RESULT: GitHubOAuthMockResult = {
  status: 'registered',
  user: {
    id: 'mock-github-user-1',
    email: 'new.user@github.example',
    username: 'githubClient1',
    providers: ['github'],
  },
}

export const GITHUB_EXISTING_USER_RESULT: GitHubOAuthMockResult = {
  status: 'linked',
  user: {
    id: 'mock-existing-user-1',
    email: 'existing.user@github.example',
    username: 'existingUser',
    providers: ['email', 'github'],
  },
}

export const delayGitHubOAuthMockResponse = () => {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

export const isGitHubOAuthMockScenario = (value: unknown): value is GitHubOAuthMockScenario => {
  return value === 'new-user' || value === 'existing-user' || value === 'error'
}

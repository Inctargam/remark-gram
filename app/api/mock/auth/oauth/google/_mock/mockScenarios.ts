import { MOCK_DELAY_MS } from './config'
import type { GoogleOAuthMockResult, GoogleOAuthMockScenario } from './types'

export const GOOGLE_NEW_USER_RESULT: GoogleOAuthMockResult = {
  status: 'registered',
  user: {
    id: 'mock-google-user-1',
    email: 'new.user@gmail.com',
    username: 'client1',
    providers: ['google'],
  },
}

export const GOOGLE_EXISTING_USER_RESULT: GoogleOAuthMockResult = {
  status: 'linked',
  user: {
    id: 'mock-existing-user-1',
    email: 'existing.user@gmail.com',
    username: 'existingUser',
    providers: ['email', 'google'],
  },
}

export const delayGoogleOAuthMockResponse = () => {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
}

export const isGoogleOAuthMockScenario = (value: unknown): value is GoogleOAuthMockScenario => {
  return value === 'new-user' || value === 'existing-user' || value === 'error'
}

import { afterEach, describe, expect, it } from 'vitest'

import { getCurrentUserId, MOCK_CURRENT_USER_ID } from './currentUser'
import { sessionStore } from './sessionStore'

describe('current user helpers', () => {
  afterEach(() => {
    sessionStore.setState({ accessToken: null, currentUser: null, status: 'loading' })
  })

  it('falls back to the mock user id before the real current user is loaded', () => {
    expect(getCurrentUserId()).toBe(MOCK_CURRENT_USER_ID)
  })

  it('uses the current authenticated user id when it is available', () => {
    sessionStore.getState().setAuthenticated('access-token', {
      avatarUrl: null,
      email: 'user@example.com',
      id: '7',
      username: 'UserName',
    })

    expect(getCurrentUserId()).toBe('7')
  })
})

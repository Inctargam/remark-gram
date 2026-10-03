import { afterEach, describe, expect, it } from 'vitest'

import type { CurrentUser } from './sessionStore'
import { sessionStore } from './sessionStore'

const CURRENT_USER: CurrentUser = {
  avatarUrl: null,
  email: 'user@example.com',
  id: 'user-1',
  username: 'UserName',
}

describe('sessionStore', () => {
  afterEach(() => {
    sessionStore.setState({
      accessToken: null,
      currentUser: null,
      currentUserLoadFailureAt: null,
      status: 'loading',
    })
  })

  it('starts in the loading state without an access token', () => {
    expect(sessionStore.getState()).toMatchObject({
      accessToken: null,
      currentUser: null,
      currentUserLoadFailureAt: null,
      status: 'loading',
    })
  })

  it('establishes and clears a session', () => {
    sessionStore.getState().setAuthenticated('access-token', CURRENT_USER)

    expect(sessionStore.getState()).toMatchObject({
      accessToken: 'access-token',
      currentUser: CURRENT_USER,
      status: 'authenticated',
    })

    sessionStore.getState().setGuest()

    expect(sessionStore.getState()).toMatchObject({
      accessToken: null,
      currentUser: null,
      status: 'guest',
    })
  })

  it('allows an authenticated session before the current user is known', () => {
    sessionStore.getState().setAuthenticated('access-token')

    expect(sessionStore.getState()).toMatchObject({
      accessToken: 'access-token',
      currentUser: null,
      status: 'authenticated',
    })
  })

  it('clears a previous identity error when a new session is established', () => {
    sessionStore.setState({ currentUserLoadFailureAt: Date.now() })

    sessionStore.getState().setAuthenticated('access-token', CURRENT_USER)

    expect(sessionStore.getState().currentUserLoadFailureAt).toBeNull()
  })

  it('clears an identity error on logout', () => {
    sessionStore.getState().setAuthenticated('access-token')
    sessionStore.setState({ currentUserLoadFailureAt: Date.now() })

    sessionStore.getState().setGuest()

    expect(sessionStore.getState().currentUserLoadFailureAt).toBeNull()
  })
})

import { afterEach, describe, expect, it } from 'vitest'

import { sessionStore } from './sessionStore'

describe('sessionStore', () => {
  afterEach(() => {
    sessionStore.setState({ accessToken: null, status: 'loading' })
  })

  it('starts in the loading state without an access token', () => {
    expect(sessionStore.getState()).toMatchObject({
      accessToken: null,
      status: 'loading',
    })
  })

  it('establishes and clears a session', () => {
    sessionStore.getState().setAuthenticated('access-token')

    expect(sessionStore.getState()).toMatchObject({
      accessToken: 'access-token',
      status: 'authenticated',
    })

    sessionStore.getState().setGuest()

    expect(sessionStore.getState()).toMatchObject({
      accessToken: null,
      status: 'guest',
    })
  })
})

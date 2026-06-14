import { describe, expect, it } from 'vitest'

import { parseGoogleOAuthCallbackParams } from './parseGoogleOAuthCallbackParams'

const INVALID_CALLBACK_PARAMS_ERROR = 'Google sign in failed. Please try again.'

describe('parseGoogleOAuthCallbackParams', () => {
  it('returns code and state for successful callback params', () => {
    expect(
      parseGoogleOAuthCallbackParams({
        code: 'google-code',
        state: 'google-state',
      })
    ).toEqual({
      code: 'google-code',
      oauthError: null,
      state: 'google-state',
    })
  })

  it('returns oauth error for failed callback params', () => {
    expect(
      parseGoogleOAuthCallbackParams({
        error: 'access_denied',
        state: 'google-state',
      })
    ).toEqual({
      code: null,
      oauthError: 'access_denied',
      state: 'google-state',
    })
  })

  it('normalizes missing callback params to null', () => {
    expect(parseGoogleOAuthCallbackParams({})).toEqual({
      code: null,
      oauthError: null,
      state: null,
    })
  })

  it.each([
    ['code', { code: ['first-code', 'second-code'] }],
    ['state', { state: ['first-state', 'second-state'] }],
    ['error', { error: ['access_denied', 'server_error'] }],
  ])('returns invalid callback error when %s is repeated', (_paramName, params) => {
    expect(parseGoogleOAuthCallbackParams(params)).toEqual({
      code: null,
      oauthError: INVALID_CALLBACK_PARAMS_ERROR,
      state: null,
    })
  })

  it('returns invalid callback error when code and oauth error are both present', () => {
    expect(
      parseGoogleOAuthCallbackParams({
        code: 'google-code',
        error: 'access_denied',
        state: 'google-state',
      })
    ).toEqual({
      code: null,
      oauthError: INVALID_CALLBACK_PARAMS_ERROR,
      state: null,
    })
  })
})

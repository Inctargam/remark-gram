import { describe, expect, it } from 'vitest'

import { parseOAuthCallbackParams } from './parseOAuthCallbackParams'

const INVALID_CALLBACK_PARAMS_ERROR = 'OAuth sign in failed. Please try again.'

describe('parseOAuthCallbackParams', () => {
  it('returns code and state for successful callback params', () => {
    expect(
      parseOAuthCallbackParams(
        {
          code: 'oauth-code',
          state: 'oauth-state',
        },
        { invalidCallbackMessage: INVALID_CALLBACK_PARAMS_ERROR }
      )
    ).toEqual({
      code: 'oauth-code',
      oauthError: null,
      state: 'oauth-state',
    })
  })

  it('returns oauth error for failed callback params', () => {
    expect(
      parseOAuthCallbackParams(
        {
          error: 'access_denied',
          state: 'oauth-state',
        },
        { invalidCallbackMessage: INVALID_CALLBACK_PARAMS_ERROR }
      )
    ).toEqual({
      code: null,
      oauthError: 'access_denied',
      state: 'oauth-state',
    })
  })

  it('normalizes missing callback params to null', () => {
    expect(
      parseOAuthCallbackParams({}, { invalidCallbackMessage: INVALID_CALLBACK_PARAMS_ERROR })
    ).toEqual({
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
    expect(
      parseOAuthCallbackParams(params, { invalidCallbackMessage: INVALID_CALLBACK_PARAMS_ERROR })
    ).toEqual({
      code: null,
      oauthError: INVALID_CALLBACK_PARAMS_ERROR,
      state: null,
    })
  })

  it('returns invalid callback error when code and oauth error are both present', () => {
    expect(
      parseOAuthCallbackParams(
        {
          code: 'oauth-code',
          error: 'access_denied',
          state: 'oauth-state',
        },
        { invalidCallbackMessage: INVALID_CALLBACK_PARAMS_ERROR }
      )
    ).toEqual({
      code: null,
      oauthError: INVALID_CALLBACK_PARAMS_ERROR,
      state: null,
    })
  })
})

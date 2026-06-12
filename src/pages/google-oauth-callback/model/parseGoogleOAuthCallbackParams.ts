type OAuthSearchParam = string | string[] | undefined

type GoogleOAuthCallbackSearchParams = {
  code?: OAuthSearchParam
  error?: OAuthSearchParam
  error_description?: OAuthSearchParam
  state?: OAuthSearchParam
}

type ParsedGoogleOAuthCallbackParams = {
  code: string | null
  oauthError: string | null
  state: string | null
}

const INVALID_CALLBACK_PARAMS_ERROR = 'Google sign in failed. Please try again.'

const parseSingleSearchParam = (value: OAuthSearchParam) => {
  if (Array.isArray(value)) {
    return {
      error: INVALID_CALLBACK_PARAMS_ERROR,
      value: null,
    }
  }

  return {
    error: null,
    value: value ?? null,
  }
}

export const parseGoogleOAuthCallbackParams = (
  params: GoogleOAuthCallbackSearchParams
): ParsedGoogleOAuthCallbackParams => {
  const code = parseSingleSearchParam(params.code)
  const state = parseSingleSearchParam(params.state)
  const oauthError = parseSingleSearchParam(params.error)
  const oauthErrorDescription = parseSingleSearchParam(params.error_description)

  const invalidParamsError =
    code.error ?? state.error ?? oauthError.error ?? oauthErrorDescription.error

  if (invalidParamsError) {
    return {
      code: null,
      oauthError: invalidParamsError,
      state: null,
    }
  }

  return {
    code: code.value,
    oauthError: oauthErrorDescription.value ?? oauthError.value,
    state: state.value,
  }
}

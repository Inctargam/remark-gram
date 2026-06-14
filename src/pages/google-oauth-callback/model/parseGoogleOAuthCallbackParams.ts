type OAuthSearchParam = string | string[] | undefined

type GoogleOAuthCallbackSearchParams = {
  code?: OAuthSearchParam
  error?: OAuthSearchParam
  state?: OAuthSearchParam
}

type ParsedGoogleOAuthCallbackParams = {
  code: string | null
  oauthError: string | null
  state: string | null
}

const INVALID_CALLBACK_PARAMS_ERROR = 'Google sign in failed. Please try again.'

const createInvalidCallbackParams = (): ParsedGoogleOAuthCallbackParams => ({
  code: null,
  oauthError: INVALID_CALLBACK_PARAMS_ERROR,
  state: null,
})

export const parseGoogleOAuthCallbackParams = (
  params: GoogleOAuthCallbackSearchParams
): ParsedGoogleOAuthCallbackParams => {
  if (Array.isArray(params.code) || Array.isArray(params.state) || Array.isArray(params.error)) {
    return createInvalidCallbackParams()
  }

  const code = params.code ?? null
  const state = params.state ?? null
  const oauthError = params.error ?? null

  if (code && oauthError) {
    return createInvalidCallbackParams()
  }

  return {
    code,
    oauthError,
    state,
  }
}

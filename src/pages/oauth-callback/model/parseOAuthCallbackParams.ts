type OAuthSearchParam = string | string[] | undefined

export type OAuthCallbackSearchParams = {
  code?: OAuthSearchParam
  error?: OAuthSearchParam
  state?: OAuthSearchParam
}

export type ParsedOAuthCallbackParams = {
  code: string | null
  oauthError: string | null
  state: string | null
}

type ParseOAuthCallbackParamsOptions = {
  invalidCallbackMessage: string
}

const createInvalidCallbackParams = (
  invalidCallbackMessage: string
): ParsedOAuthCallbackParams => ({
  code: null,
  oauthError: invalidCallbackMessage,
  state: null,
})

export const parseOAuthCallbackParams = (
  params: OAuthCallbackSearchParams,
  { invalidCallbackMessage }: ParseOAuthCallbackParamsOptions
): ParsedOAuthCallbackParams => {
  if (Array.isArray(params.code) || Array.isArray(params.state) || Array.isArray(params.error)) {
    return createInvalidCallbackParams(invalidCallbackMessage)
  }

  const code = params.code ?? null
  const state = params.state ?? null
  const oauthError = params.error ?? null

  if (code && oauthError) {
    return createInvalidCallbackParams(invalidCallbackMessage)
  }

  return {
    code,
    oauthError,
    state,
  }
}

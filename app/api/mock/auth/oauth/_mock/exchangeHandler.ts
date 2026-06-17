type OAuthMockRequest = {
  code?: string
  state?: string
}

type CreateOAuthMockExchangeHandlerParams<Payload extends OAuthMockRequest, Result> = {
  clearStateCookie: string
  exchangeCode: (payload: Payload) => Promise<Result>
  invalidStateMessage: string
  isStateValid: (request: Request, state: string | undefined) => boolean
  missingCodeMessage: string
  parseRequest: (request: Request) => Promise<Payload | null>
  serverErrorMessage: string
}

const ACCESS_TOKEN_COOKIE =
  'accessToken=mock-access-token; HttpOnly; Path=/; SameSite=Lax; Max-Age=900'
const REFRESH_TOKEN_COOKIE =
  'refreshToken=mock-refresh-token; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800'

export const createOAuthMockExchangeHandler = <Payload extends OAuthMockRequest, Result>({
  clearStateCookie,
  exchangeCode,
  invalidStateMessage,
  isStateValid,
  missingCodeMessage,
  parseRequest,
  serverErrorMessage,
}: CreateOAuthMockExchangeHandlerParams<Payload, Result>) => {
  return async (request: Request) => {
    const payload = await parseRequest(request)

    if (!payload?.code) {
      return Response.json({ message: missingCodeMessage }, { status: 400 })
    }

    if (!isStateValid(request, payload.state)) {
      return Response.json({ message: invalidStateMessage }, { status: 400 })
    }

    try {
      const result = await exchangeCode(payload)
      const response = Response.json(result)

      response.headers.append('Set-Cookie', ACCESS_TOKEN_COOKIE)
      response.headers.append('Set-Cookie', REFRESH_TOKEN_COOKIE)
      response.headers.append('Set-Cookie', clearStateCookie)

      return response
    } catch {
      return Response.json({ message: serverErrorMessage }, { status: 500 })
    }
  }
}

import { exchangeGoogleOAuthMockCode, parseGoogleOAuthMockRequest } from './googleOAuthMock'
import { clearGoogleOAuthMockStateCookie, isGoogleOAuthMockStateValid } from './stateCookie'

const ACCESS_TOKEN_COOKIE =
  'accessToken=mock-access-token; HttpOnly; Path=/; SameSite=Lax; Max-Age=900'
const REFRESH_TOKEN_COOKIE =
  'refreshToken=mock-refresh-token; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800'

export const exchangeGoogleOAuthCodeHandler = async (request: Request) => {
  const payload = await parseGoogleOAuthMockRequest(request)

  if (!payload?.code) {
    return Response.json({ message: 'Google OAuth code is required.' }, { status: 400 })
  }

  if (!isGoogleOAuthMockStateValid(request, payload.state)) {
    return Response.json({ message: 'Google OAuth state is invalid.' }, { status: 400 })
  }

  try {
    const result = await exchangeGoogleOAuthMockCode(payload)
    const response = Response.json(result)

    response.headers.append('Set-Cookie', ACCESS_TOKEN_COOKIE)
    response.headers.append('Set-Cookie', REFRESH_TOKEN_COOKIE)
    response.headers.append('Set-Cookie', clearGoogleOAuthMockStateCookie)

    return response
  } catch {
    return Response.json({ message: 'Google OAuth mock exchange failed.' }, { status: 500 })
  }
}

import { GOOGLE_OAUTH_CONFIG } from './config'

const getCookieValue = (request: Request, name: string) => {
  const cookieHeader = request.headers.get('cookie')

  if (!cookieHeader) {
    return null
  }

  const cookie = cookieHeader
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null
}

export const createGoogleOAuthMockState = () => {
  return crypto.randomUUID()
}

export const createGoogleOAuthMockStateCookie = (state: string) => {
  return `${GOOGLE_OAUTH_CONFIG.stateCookieName}=${encodeURIComponent(
    state
  )}; HttpOnly; Path=/; SameSite=Lax; Max-Age=600`
}

export const clearGoogleOAuthMockStateCookie = `${GOOGLE_OAUTH_CONFIG.stateCookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`

export const isGoogleOAuthMockStateValid = (request: Request, state: string | undefined) => {
  const expectedState = getCookieValue(request, GOOGLE_OAUTH_CONFIG.stateCookieName)

  if (!expectedState || !state) {
    return false
  }

  return expectedState === state
}

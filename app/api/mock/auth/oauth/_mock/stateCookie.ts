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

export const createOAuthMockState = () => {
  return crypto.randomUUID()
}

export const createOAuthMockStateCookie = (stateCookieName: string, state: string) => {
  return `${stateCookieName}=${encodeURIComponent(
    state
  )}; HttpOnly; Path=/; SameSite=Lax; Max-Age=600`
}

export const createClearOAuthMockStateCookie = (stateCookieName: string) => {
  return `${stateCookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
}

export const isOAuthMockStateValid = (
  request: Request,
  stateCookieName: string,
  state: string | undefined
) => {
  const expectedState = getCookieValue(request, stateCookieName)

  if (!expectedState || !state) {
    return false
  }

  return expectedState === state
}

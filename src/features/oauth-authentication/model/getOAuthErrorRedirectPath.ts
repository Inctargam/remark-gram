import { ROUTES } from '@/shared/config'

type OAuthErrorSearchParam = string | string[] | undefined

export const getOAuthErrorRedirectPath = (error: OAuthErrorSearchParam) => {
  if (typeof error !== 'string') {
    return null
  }

  const signInSearchParams = new URLSearchParams({ error })

  return `${ROUTES.signIn}?${signInSearchParams}`
}

import { GoogleOAuthCallbackPage } from '@/pages/google-oauth-callback'

type Props = {
  searchParams: Promise<{
    code?: string | string[]
    error?: string | string[]
    error_description?: string | string[]
    state?: string | string[]
  }>
}

const getSearchParam = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null)
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const oauthError = getSearchParam(params.error_description) ?? getSearchParam(params.error)

  return (
    <GoogleOAuthCallbackPage
      code={getSearchParam(params.code)}
      state={getSearchParam(params.state)}
      oauthError={oauthError}
    />
  )
}

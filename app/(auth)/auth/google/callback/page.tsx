import {
  GoogleOAuthCallbackPage,
  parseGoogleOAuthCallbackParams,
} from '@/pages/google-oauth-callback'

type Props = {
  searchParams: Promise<{
    code?: string | string[]
    error?: string | string[]
    error_description?: string | string[]
    state?: string | string[]
  }>
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const parsedParams = parseGoogleOAuthCallbackParams(params)

  return <GoogleOAuthCallbackPage {...parsedParams} />
}

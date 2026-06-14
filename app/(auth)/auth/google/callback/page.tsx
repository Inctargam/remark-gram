import { GoogleOAuthCallbackProcessor } from '@/features/oauth-sign-in'
import { parseGoogleOAuthCallbackParams } from '@/pages/google-oauth-callback'

type Props = {
  searchParams: Promise<{
    code?: string | string[]
    error?: string | string[]
    state?: string | string[]
  }>
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const parsedParams = parseGoogleOAuthCallbackParams(params)

  return <GoogleOAuthCallbackProcessor {...parsedParams} />
}

import { OAuthCallbackProcessor } from '@/features/oauth-sign-in'
import { parseOAuthCallbackParams } from '@/pages/oauth-callback'

type Props = {
  searchParams: Promise<{
    code?: string | string[]
    error?: string | string[]
    state?: string | string[]
  }>
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const parsedParams = parseOAuthCallbackParams(params, {
    invalidCallbackMessage: 'GitHub sign in failed. Please try again.',
  })

  return <OAuthCallbackProcessor provider="github" {...parsedParams} />
}

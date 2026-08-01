import { redirect } from 'next/navigation'

import { getOAuthErrorRedirectPath } from '@/features/oauth-authentication'
import { HomePage } from '@/pages/home'

type Props = {
  searchParams: Promise<{
    error?: string | string[]
  }>
}

export default async function Page({ searchParams }: Props) {
  const { error } = await searchParams
  const redirectPath = getOAuthErrorRedirectPath(error)

  if (redirectPath) {
    redirect(redirectPath)
  }

  return <HomePage />
}

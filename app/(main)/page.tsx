import { redirect } from 'next/navigation'

import { getOAuthErrorRedirectPath } from '@/features/oauth-authentication'
import { HomePage } from '@/pages/home'
import { getHomePagePosts, getHomePageUsersCount } from '@/shared/api/homePageData'

export const revalidate = 60

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

  const [{ items: posts }, { totalCount }] = await Promise.all([
    getHomePagePosts(),
    getHomePageUsersCount(),
  ])

  return <HomePage posts={posts} registeredUsersCount={totalCount} />
}

import { ProfilePage } from '@/pages/profile'

import { normalizePostId } from './normalizePostId'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    postId?: string | string[]
  }>
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const { postId } = await searchParams

  return <ProfilePage postId={normalizePostId(postId)} userId={id} />
}

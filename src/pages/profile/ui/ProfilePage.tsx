import { HydrationBoundary } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

import { getProfilePostServer, prefetchProfilePostsQueryServer } from '@/entities/post/index.server'

import { getPublicProfile } from '../api/publicProfile.server'
import { ProfilePageView } from './ProfilePageView'

type Props = {
  postId: string | null
  userId: string
}

export const ProfilePage = async ({ postId, userId }: Props) => {
  const [profile, prefetchedPosts, initialSelectedPost] = await Promise.all([
    getPublicProfile(userId),
    prefetchProfilePostsQueryServer(userId),
    postId ? getProfilePostServer({ userId, postId }) : null,
  ])

  if (!profile || !prefetchedPosts) {
    notFound()
  }

  if (postId && !initialSelectedPost) {
    notFound()
  }

  return (
    <HydrationBoundary state={prefetchedPosts.dehydratedState}>
      <ProfilePageView
        initialSelectedPost={initialSelectedPost}
        profile={profile}
        userId={userId}
      />
    </HydrationBoundary>
  )
}

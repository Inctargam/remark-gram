import { notFound } from 'next/navigation'

import { getProfilePostServer, getProfilePostsServer } from '@/entities/post/index.server'

import { getPublicProfile } from '../api/publicProfile.server'
import { ProfilePageView } from './ProfilePageView'

type Props = {
  postId: string | null
  userId: string
}

export const ProfilePage = async ({ postId, userId }: Props) => {
  const [profile, initialPostsPage, initialSelectedPost] = await Promise.all([
    getPublicProfile(userId),
    getProfilePostsServer({ userId }),
    postId ? getProfilePostServer({ userId, postId }) : null,
  ])

  if (!profile || !initialPostsPage) {
    notFound()
  }

  if (postId && !initialSelectedPost) {
    notFound()
  }

  return (
    <ProfilePageView
      initialPostsPage={initialPostsPage}
      initialSelectedPost={initialSelectedPost}
      profile={profile}
      userId={userId}
    />
  )
}

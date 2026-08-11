import { notFound } from 'next/navigation'

import { getPostServer, getProfilePostsServer } from '@/entities/post/index.server'

import { getPublicProfile } from '../api/publicProfile.server'
import { isSelectedProfilePost } from '../model/selectedProfilePost'
import { ProfilePageView } from './ProfilePageView'

type Props = {
  postId: string | null
  userId: string
}

export const ProfilePage = async ({ postId, userId }: Props) => {
  const [profile, initialPostsPage, initialSelectedPost] = await Promise.all([
    getPublicProfile(userId),
    getProfilePostsServer({ userId }),
    postId ? getPostServer(postId) : null,
  ])

  if (!profile || !initialPostsPage) {
    notFound()
  }

  if (postId && (!initialSelectedPost || !isSelectedProfilePost(initialSelectedPost, userId))) {
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

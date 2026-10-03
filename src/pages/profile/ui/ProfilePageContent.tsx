'use client'

import type { Post } from '@/entities/post'

import type { PublicProfile } from '../model/publicProfile'
import { useProfilePage } from '../model/useProfilePage'
import { ProfilePageView } from './ProfilePageView'

type Props = {
  initialProfile: PublicProfile | null
  initialSelectedPost: Post | null
  userId: string
}

export const ProfilePageContent = ({ initialProfile, initialSelectedPost, userId }: Props) => {
  const { profile, isError, reloadProfile } = useProfilePage(userId, initialProfile)

  const retryHandler = () => {
    void reloadProfile()
  }

  if (isError) {
    return (
      <div role="alert">
        <p>Failed to load profile.</p>
        <button type="button" onClick={retryHandler}>
          Retry
        </button>
      </div>
    )
  }

  if (!profile) {
    return <p role="status">Loading profile...</p>
  }

  return (
    <ProfilePageView initialSelectedPost={initialSelectedPost} profile={profile} userId={userId} />
  )
}

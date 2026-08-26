import { countUserPosts, MOCK_OTHER_USER_ID } from '@/shared/api/mock/postsStore'
import { MOCK_CURRENT_USER_ID } from '@/shared/auth'

import { isBackendProfileUserId } from '../model/profileRoute'
import type { PublicProfile } from '../model/publicProfile'

type MockProfile = Omit<PublicProfile, 'publicationsCount'>

const MOCK_PUBLIC_PROFILES: Record<string, MockProfile> = {
  [MOCK_CURRENT_USER_ID]: {
    id: MOCK_CURRENT_USER_ID,
    username: 'UserName',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    followingCount: 2218,
    followersCount: 2358,
    avatarUrl: null,
  },
  [MOCK_OTHER_USER_ID]: {
    id: MOCK_OTHER_USER_ID,
    username: 'OtherUser',
    description: 'Mock profile for a second author. Used to verify public profile SSR states.',
    followingCount: 128,
    followersCount: 642,
    avatarUrl: null,
  },
}

const createBackendProfilePlaceholder = (userId: string): PublicProfile => ({
  id: userId,
  username: `User ${userId}`,
  description: '',
  followingCount: 0,
  followersCount: 0,
  publicationsCount: 0,
  avatarUrl: null,
})

export const getPublicProfile = (userId: string): PublicProfile | null => {
  const profile = MOCK_PUBLIC_PROFILES[userId]

  if (!profile) {
    if (isBackendProfileUserId(userId)) {
      return createBackendProfilePlaceholder(userId)
    }

    return null
  }

  return {
    ...profile,
    publicationsCount: countUserPosts(userId),
  }
}

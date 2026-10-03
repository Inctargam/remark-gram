import type { QueryClient } from '@tanstack/react-query'

import { sessionStore } from '@/shared/auth'

import { getProfileAvatarUrl } from '../lib/getProfileAvatarUrl'
import type { Profile } from '../model/profileTypes'
import { profileQueryKeys } from './profileQueryKeys'

export const updateCurrentProfileCaches = (queryClient: QueryClient, profile: Profile) => {
  const { accessToken, currentUser } = sessionStore.getState()

  // A cancelled refetch can return cached data after logout has cleared the query client.
  if (!accessToken || currentUser?.id !== String(profile.id)) {
    return
  }

  queryClient.setQueryData(profileQueryKeys.current(), profile)
  sessionStore.getState().setAuthenticated(accessToken, {
    ...currentUser,
    username: profile.userName,
    avatarUrl: getProfileAvatarUrl(profile.avatarFileId),
  })

  void queryClient.invalidateQueries({
    queryKey: profileQueryKeys.public(String(profile.id)),
    exact: true,
  })
}

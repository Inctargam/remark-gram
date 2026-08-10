import type { QueryClient } from '@tanstack/react-query'

import { type Profile, type ProfileAvatarsResponse, profileQueryKeys } from '@/entities/profile'

export const updateProfileAvatarCache = (
  queryClient: QueryClient,
  { avatars }: ProfileAvatarsResponse
) => {
  queryClient.setQueryData<Profile>(profileQueryKeys.current(), (profile) => {
    return profile ? { ...profile, avatars } : profile
  })
}

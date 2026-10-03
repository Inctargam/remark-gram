import { getProfileAvatarUrl, useProfileQuery, usePublicProfileQuery } from '@/entities/profile'
import {
  loadCurrentUser,
  useCurrentUser,
  useCurrentUserLoadError,
  useSessionStatus,
} from '@/shared/auth'

import { isBackendProfileUserId } from './profileRoute'
import type { PublicProfile } from './publicProfile'

export const useProfilePage = (userId: string, initialProfile: PublicProfile | null) => {
  const currentUser = useCurrentUser()
  const hasCurrentUserLoadError = useCurrentUserLoadError()
  const sessionStatus = useSessionStatus()
  const isBackendProfile = isBackendProfileUserId(userId)
  const isOwnProfile = currentUser?.id === userId
  const isSessionResolved =
    sessionStatus === 'guest' || (sessionStatus === 'authenticated' && currentUser !== null)
  const isSessionLoadError =
    sessionStatus === 'authenticated' && currentUser === null && hasCurrentUserLoadError
  const canLoadProfile = isBackendProfile && isSessionResolved
  const currentProfileQuery = useProfileQuery(canLoadProfile && isOwnProfile)
  const publicProfileQuery = usePublicProfileQuery(userId, canLoadProfile && !isOwnProfile)
  const profileQuery = isOwnProfile ? currentProfileQuery : publicProfileQuery
  const loadedProfile = canLoadProfile ? profileQuery.data : undefined

  const profile: PublicProfile | null = loadedProfile
    ? {
        id: String(loadedProfile.id),
        username: loadedProfile.userName,
        description: loadedProfile.aboutMe,
        avatarUrl: getProfileAvatarUrl(loadedProfile.avatarFileId),
        followingCount: 0,
        followersCount: 0,
        publicationsCount: 0,
      }
    : initialProfile

  const isError =
    isBackendProfile && !profile && (isSessionLoadError || (canLoadProfile && profileQuery.isError))

  const reloadProfile = () =>
    isSessionLoadError ? loadCurrentUser().catch(() => null) : profileQuery.refetch()

  return {
    profile,
    isError,
    reloadProfile,
  }
}

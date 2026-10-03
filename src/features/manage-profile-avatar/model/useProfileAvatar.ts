import { getProfileAvatarUrl, useProfileQuery } from '@/entities/profile'

export const useProfileAvatar = () => {
  const profileQuery = useProfileQuery()

  const avatarUrl = getProfileAvatarUrl(profileQuery.data?.avatarFileId)

  return avatarUrl ? { url: avatarUrl } : null
}

import { selectLargestProfileAvatar, useProfileQuery } from '@/entities/profile'
import { API_BASE_URL } from '@/shared/config'

export const useProfileAvatar = () => {
  const profileQuery = useProfileQuery()

  const avatarFileId = profileQuery.data?.avatarFileId

  if (avatarFileId) {
    return { url: `${API_BASE_URL}/api/v1/files/images/${avatarFileId}` }
  }

  return selectLargestProfileAvatar(profileQuery.data?.avatars ?? [])
}

import { selectLargestProfileAvatar, useProfileQuery } from '@/entities/profile'

export const useProfileAvatar = () => {
  const profileQuery = useProfileQuery()

  return selectLargestProfileAvatar(profileQuery.data?.avatars ?? [])
}

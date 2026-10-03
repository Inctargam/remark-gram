import { apiClient } from '@/shared/api/openapi'

import type { PublicProfile } from '../model/publicProfile'

export const getPublicProfile = async (userId: string): Promise<PublicProfile> => {
  const { data, response } = await apiClient.GET('/api/v1/users/{userId}/profile', {
    params: { path: { userId: Number(userId) } },
  })

  if (!response.ok || !data) {
    throw new Error(`Failed to load public profile (${response.status})`)
  }

  return {
    id: data.userId,
    userName: data.username,
    aboutMe: data.aboutMe ?? '',
    avatarFileId: data.avatarFileId,
  }
}

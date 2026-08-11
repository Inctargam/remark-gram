import type { ProfileAvatarsResponse } from '@/entities/profile'
import { api } from '@/shared/api/baseApi'

const PROFILE_AVATAR_API_PATH = '/api/v1/profile/avatar'

// TODO(profile-api): Replace these local mock requests with the typed OpenAPI client once the
// backend exposes the profile avatar endpoints in the schema.
export const uploadProfileAvatar = async (file: File): Promise<ProfileAvatarsResponse> => {
  const formData = new FormData()

  formData.append('file', file)

  const response = await api.postForm(PROFILE_AVATAR_API_PATH, formData, { baseUrl: '' })

  return response.json()
}

export const deleteProfileAvatar = async (): Promise<ProfileAvatarsResponse> => {
  const response = await api.delete(PROFILE_AVATAR_API_PATH, { baseUrl: '' })

  return response.json()
}

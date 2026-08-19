import type { Profile } from '@/entities/profile'
import { api } from '@/shared/api/baseApi'

import type { UpdateProfilePayload } from '../model/editProfileTypes'

const PROFILE_API_PATH = '/api/mock/profile'

// TODO(profile-api): Replace the local mock request with the typed OpenAPI client once the
// backend exposes the profile endpoint in the schema.
export const updateProfile = async (payload: UpdateProfilePayload): Promise<Profile> => {
  const response = await api.put(PROFILE_API_PATH, payload, { baseUrl: '' })

  return response.json()
}

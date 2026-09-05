import type { Profile } from '@/entities/profile'
import { api } from '@/shared/api/baseApi'

const PROFILE_API_PATH = '/api/mock/profile'

// TODO(profile-api): Replace the local mock request with the typed OpenAPI client once the
// backend exposes the profile endpoint in the schema.
export const getProfile = async (): Promise<Profile> => {
  const response = await api.get(PROFILE_API_PATH, { baseUrl: '' })

  return response.json()
}

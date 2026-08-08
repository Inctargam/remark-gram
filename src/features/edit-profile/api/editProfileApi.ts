import { api } from '@/shared/api/baseApi'

import type { ProfileDto, UpdateProfilePayload } from '../model/editProfileTypes'

const PROFILE_API_PATH = '/api/v1/profile'

export const getProfile = async (): Promise<ProfileDto> => {
  const response = await api.get(PROFILE_API_PATH, { baseUrl: '' })

  return response.json()
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<ProfileDto> => {
  const response = await api.put(PROFILE_API_PATH, payload, { baseUrl: '' })

  return response.json()
}

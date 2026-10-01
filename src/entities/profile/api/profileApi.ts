import type { Profile } from '@/entities/profile'
import { apiClient } from '@/shared/api/openapi'
import type { SchemaMyProfileResponseDto } from '@/shared/api/openapi/schema'

export const mapMyProfile = (profile: SchemaMyProfileResponseDto): Profile => ({
  id: profile.userId,
  userName: profile.username,
  firstName: profile.firstName ?? '',
  lastName: profile.lastName ?? '',
  dateOfBirth: profile.dateOfBirth,
  country: profile.country?.name.en ?? '',
  countryCode: profile.country?.code ?? null,
  city: profile.city ?? '',
  aboutMe: profile.aboutMe ?? '',
  avatarFileId: profile.avatarFileId,
  avatars: [],
})

export const getProfile = async (): Promise<Profile> => {
  const { data, response } = await apiClient.GET('/api/v1/users/me/profile')

  if (!response.ok || !data) {
    throw new Error(`Failed to load profile (${response.status})`)
  }

  return mapMyProfile(data)
}

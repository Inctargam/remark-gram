// TODO: Replace these local DTOs with generated OpenAPI types once the profile endpoints
// are available in the backend schema.
export type ProfileAvatarDto = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
}

export type ProfileDto = {
  id: number
  userName: string
  firstName: string
  lastName: string
  city: string
  country: string
  region: string
  dateOfBirth: string | null
  aboutMe: string
  avatars: ProfileAvatarDto[]
  createdAt: string
}

export type UpdateProfilePayload = Pick<
  ProfileDto,
  'userName' | 'firstName' | 'lastName' | 'city' | 'country' | 'region' | 'dateOfBirth' | 'aboutMe'
>

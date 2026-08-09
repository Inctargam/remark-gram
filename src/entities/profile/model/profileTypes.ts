// TODO(profile-api): Replace these temporary types with generated OpenAPI types once the
// backend exposes the profile endpoints in the schema.
export type ProfileAvatar = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
}

export type Profile = {
  id: number
  userName: string
  firstName: string
  lastName: string
  city: string
  country: string
  region: string
  dateOfBirth: string | null
  aboutMe: string
  avatars: ProfileAvatar[]
  createdAt: string
}

export type ProfileAvatarsResponse = Pick<Profile, 'avatars'>

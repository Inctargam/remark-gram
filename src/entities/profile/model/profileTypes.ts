// Avatar mock responses still use this shape until the avatar workflow migrates to the backend.
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
  dateOfBirth: string | null
  aboutMe: string
  avatars: ProfileAvatar[]
  countryCode: string | null
  avatarFileId: string | null
}

export type ProfileAvatarsResponse = Pick<Profile, 'avatars'>

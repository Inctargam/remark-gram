import type { Profile } from './profileTypes'

export type PublicProfile = Pick<Profile, 'id' | 'userName' | 'aboutMe' | 'avatarFileId'>

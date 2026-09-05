export type MockProfileAvatar = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
}

export type MockProfile = {
  id: number
  userName: string
  firstName: string
  lastName: string
  city: string
  country: string
  region: string
  dateOfBirth: string | null
  aboutMe: string
  avatars: MockProfileAvatar[]
  createdAt: string
}

export type MockProfileUpdate = Pick<
  MockProfile,
  'userName' | 'firstName' | 'lastName' | 'city' | 'country' | 'region' | 'dateOfBirth' | 'aboutMe'
>

const STORE_KEY = '__inctagramProfileMockStore'
const AVATAR_FILE_STORE_KEY = '__inctagramProfileMockAvatarFileStore'

type MockProfileAvatarFile = {
  bytes: Uint8Array
  contentType: string
}

type GlobalWithProfileStore = typeof globalThis & {
  [STORE_KEY]?: MockProfile
  [AVATAR_FILE_STORE_KEY]?: MockProfileAvatarFile
}

const createInitialProfile = (): MockProfile => ({
  id: 1,
  userName: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  city: 'Austin',
  country: 'United States',
  region: 'Texas',
  dateOfBirth: '1990-01-01',
  aboutMe: 'About me',
  avatars: [],
  createdAt: '2026-08-06T14:41:15.904Z',
})

const getState = () => {
  const globalWithStore = globalThis as GlobalWithProfileStore

  globalWithStore[STORE_KEY] ??= createInitialProfile()

  return globalWithStore[STORE_KEY]
}

export const getMockProfile = (): MockProfile => structuredClone(getState())

export const updateMockProfile = (update: MockProfileUpdate): MockProfile => {
  const profile = getState()

  Object.assign(profile, update)

  return structuredClone(profile)
}

export const updateMockProfileAvatar = ({
  bytes,
  contentType,
  fileSize,
}: MockProfileAvatarFile & { fileSize: number }): MockProfileAvatar[] => {
  const profile = getState()
  const createdAt = new Date().toISOString()
  const avatarUrl = (size: number) =>
    `/api/mock/profile/avatar/image?size=${size}&version=${encodeURIComponent(createdAt)}`

  profile.avatars = [
    { url: avatarUrl(192), width: 192, height: 192, fileSize, createdAt },
    { url: avatarUrl(45), width: 45, height: 45, fileSize, createdAt },
  ]
  ;(globalThis as GlobalWithProfileStore)[AVATAR_FILE_STORE_KEY] = {
    bytes: new Uint8Array(bytes),
    contentType,
  }

  return structuredClone(profile.avatars)
}

export const deleteMockProfileAvatar = (): MockProfileAvatar[] => {
  const profile = getState()

  profile.avatars = []
  delete (globalThis as GlobalWithProfileStore)[AVATAR_FILE_STORE_KEY]

  return []
}

export const getMockProfileAvatarFile = (): MockProfileAvatarFile | null => {
  const avatarFile = (globalThis as GlobalWithProfileStore)[AVATAR_FILE_STORE_KEY]

  if (!avatarFile) {
    return null
  }

  return {
    bytes: new Uint8Array(avatarFile.bytes),
    contentType: avatarFile.contentType,
  }
}

/** Test-only: restores the deterministic seed profile. */
export const resetMockProfile = () => {
  const globalWithStore = globalThis as GlobalWithProfileStore

  globalWithStore[STORE_KEY] = createInitialProfile()
  delete globalWithStore[AVATAR_FILE_STORE_KEY]
}

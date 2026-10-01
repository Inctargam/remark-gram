export type MockProfileAvatar = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
}

type MockProfileAvatarFile = {
  bytes: Uint8Array
  contentType: string
}

type MockProfileAvatarState = {
  avatars: MockProfileAvatar[]
  file: MockProfileAvatarFile | null
}

const STORE_KEY = '__inctagramProfileMockAvatarStore'

type GlobalWithAvatarStore = typeof globalThis & {
  [STORE_KEY]?: MockProfileAvatarState
}

const getState = (): MockProfileAvatarState => {
  const globalWithStore = globalThis as GlobalWithAvatarStore

  globalWithStore[STORE_KEY] ??= { avatars: [], file: null }

  return globalWithStore[STORE_KEY]
}

export const getMockProfileAvatars = (): MockProfileAvatar[] => structuredClone(getState().avatars)

export const updateMockProfileAvatar = ({
  bytes,
  contentType,
  fileSize,
}: MockProfileAvatarFile & { fileSize: number }): MockProfileAvatar[] => {
  const state = getState()
  const createdAt = new Date().toISOString()
  const avatarUrl = (size: number) =>
    `/api/mock/profile/avatar/image?size=${size}&version=${encodeURIComponent(createdAt)}`

  state.avatars = [
    { url: avatarUrl(192), width: 192, height: 192, fileSize, createdAt },
    { url: avatarUrl(45), width: 45, height: 45, fileSize, createdAt },
  ]
  state.file = { bytes: new Uint8Array(bytes), contentType }

  return structuredClone(state.avatars)
}

export const deleteMockProfileAvatar = (): MockProfileAvatar[] => {
  const state = getState()

  state.avatars = []
  state.file = null

  return []
}

export const getMockProfileAvatarFile = (): MockProfileAvatarFile | null => {
  const file = getState().file

  return file ? { bytes: new Uint8Array(file.bytes), contentType: file.contentType } : null
}

/** Test-only: restores the empty avatar state. */
export const resetMockProfileAvatar = () => {
  ;(globalThis as GlobalWithAvatarStore)[STORE_KEY] = { avatars: [], file: null }
}

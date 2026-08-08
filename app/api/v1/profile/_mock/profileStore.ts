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

type GlobalWithProfileStore = typeof globalThis & {
  [STORE_KEY]?: MockProfile
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

/** Test-only: restores the deterministic seed profile. */
export const resetMockProfile = () => {
  ;(globalThis as GlobalWithProfileStore)[STORE_KEY] = createInitialProfile()
}

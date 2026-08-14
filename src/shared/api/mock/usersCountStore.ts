const STORE_KEY = '__inctagramUsersCountMock'

type UsersCountState = {
  totalCount: number
}

type GlobalWithUsersCountStore = typeof globalThis & {
  [STORE_KEY]?: UsersCountState
}

const SEED_COUNT = 9_213

const getState = (): UsersCountState => {
  const globalWithStore = globalThis as GlobalWithUsersCountStore

  globalWithStore[STORE_KEY] ??= { totalCount: SEED_COUNT }

  return globalWithStore[STORE_KEY]
}

export const getRegisteredUsersCount = (): number => getState().totalCount

export const resetUsersCountStore = () => {
  ;(globalThis as GlobalWithUsersCountStore)[STORE_KEY] = { totalCount: SEED_COUNT }
}

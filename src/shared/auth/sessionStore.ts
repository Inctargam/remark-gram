import { createStore } from 'zustand/vanilla'

export type SessionStatus = 'loading' | 'authenticated' | 'guest'

export type CurrentUser = {
  avatarUrl: string | null
  email: string
  id: string
  username: string
}

type SessionState = {
  accessToken: string | null
  currentUser: CurrentUser | null
  currentUserLoadFailureAt: number | null
  status: SessionStatus
  setAuthenticated: (accessToken: string, currentUser?: CurrentUser | null) => void
  setGuest: () => void
}

export const sessionStore = createStore<SessionState>()((set) => ({
  accessToken: null,
  currentUser: null,
  currentUserLoadFailureAt: null,
  status: 'loading',
  setAuthenticated: (accessToken, currentUser = null) =>
    set({ accessToken, currentUser, currentUserLoadFailureAt: null, status: 'authenticated' }),
  setGuest: () =>
    set({ accessToken: null, currentUser: null, currentUserLoadFailureAt: null, status: 'guest' }),
}))

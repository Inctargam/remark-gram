import { createStore } from 'zustand/vanilla'

export type SessionStatus = 'loading' | 'authenticated' | 'guest'

type SessionState = {
  accessToken: string | null
  status: SessionStatus
  setAuthenticated: (accessToken: string) => void
  setGuest: () => void
}

export const sessionStore = createStore<SessionState>()((set) => ({
  accessToken: null,
  status: 'loading',
  setAuthenticated: (accessToken) => set({ accessToken, status: 'authenticated' }),
  setGuest: () => set({ accessToken: null, status: 'guest' }),
}))

import { sessionStore } from './sessionStore'

export const checkMockAuth = async () => {
  try {
    const response = await fetch('/api/mock/auth/me', {
      headers: { Authorization: 'Bearer mock-token' },
    })

    if (response.ok) {
      sessionStore.getState().setAuthenticated('mock-token')

      return
    }

    sessionStore.getState().setGuest()
  } catch {
    sessionStore.getState().setGuest()
  }
}

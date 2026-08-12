import type { CurrentUser } from './sessionStore'
import { sessionStore } from './sessionStore'

export const checkMockAuth = async () => {
  try {
    const response = await fetch('/api/mock/auth/me', {
      headers: { Authorization: 'Bearer mock-token' },
    })

    if (response.ok) {
      const currentUser = (await response.json()) as CurrentUser

      sessionStore.getState().setAuthenticated('mock-token', currentUser)

      return
    }

    sessionStore.getState().setGuest()
  } catch {
    sessionStore.getState().setGuest()
  }
}

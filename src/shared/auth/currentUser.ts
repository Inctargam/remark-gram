import { sessionStore } from './sessionStore'

/**
 * Single answer to "who am I" for ownership checks (edit/delete a post, profile settings).
 * Kept in one place on purpose: the check must not be spread over components.
 *
 * Mock fallback stays for local mock data. In real auth mode, `currentUser` is loaded
 * from `GET /api/v1/auth/me` and becomes the source for ownership checks.
 */
export const MOCK_CURRENT_USER_ID = 'mock-user-1'

export const getCurrentUserId = (): string =>
  sessionStore.getState().currentUser?.id ?? MOCK_CURRENT_USER_ID

export const isProfileOwner = (profileUserId: string): boolean =>
  profileUserId === getCurrentUserId()

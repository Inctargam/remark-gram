/**
 * Single answer to "who am I" for ownership checks (edit/delete a post, profile settings).
 * Kept in one place on purpose: the check must not be spread over components.
 *
 * TODO(post-ownership): the session carries only an access token today. Replace the mock id
 * with the real one once the backend exposes `GET /auth/me` (or the id lands in the JWT payload).
 */
export const MOCK_CURRENT_USER_ID = 'mock-user-1'

export const getCurrentUserId = (): string => MOCK_CURRENT_USER_ID

export const isProfileOwner = (profileUserId: string): boolean =>
  profileUserId === getCurrentUserId()

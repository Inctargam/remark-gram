/**
 * Notification queries share one root so realtime events, mark-read mutations and logout
 * cleanup can invalidate or clear the whole slice without spelling keys by hand.
 */
const getNotificationsListScope = () => {
  if (process.env.NEXT_PUBLIC_NOTIFICATIONS_API_MOCK === 'false') {
    return 'real'
  }

  if (process.env.NEXT_PUBLIC_NOTIFICATIONS_MOCK_REALTIME === 'true') {
    return 'mock-realtime'
  }

  return 'mock-static'
}

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationQueryKeys.all, 'list'] as const,
  list: (limit: number) =>
    [...notificationQueryKeys.lists(), getNotificationsListScope(), limit] as const,
}

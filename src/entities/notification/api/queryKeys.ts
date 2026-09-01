/**
 * Notification queries share one root so realtime events, mark-read mutations and logout
 * cleanup can invalidate or clear the whole slice without spelling keys by hand.
 */
export const notificationQueryKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationQueryKeys.all, 'list'] as const,
  list: (limit: number) => [...notificationQueryKeys.lists(), limit] as const,
}

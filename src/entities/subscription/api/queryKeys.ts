/**
 * Single key factory for subscription queries. `features/buy-subscription` and
 * `features/cancel-auto-renewal` invalidate through it, so a key is never spelled out twice.
 */
export const subscriptionQueryKeys = {
  all: ['subscription'] as const,
  current: () => [...subscriptionQueryKeys.all, 'current'] as const,
}

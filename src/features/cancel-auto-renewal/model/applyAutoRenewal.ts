import type { AccountStatus } from '@/entities/subscription'

/**
 * Applies the new flag to the account status the way the server would: only the tail of the
 * queue carries auto-renewal (Р5), and `nextPaymentAt` exists only while it is on.
 *
 * Used for the optimistic cache write, so the checkbox and the `Next payment` date move
 * together instead of the date lagging a round trip behind.
 */
export const applyAutoRenewal = (status: AccountStatus, autoRenewal: boolean): AccountStatus => {
  const tail = status.subscriptions.at(-1)

  if (!tail) {
    return status
  }

  return {
    ...status,
    subscriptions: status.subscriptions.map((subscription) =>
      subscription.id === tail.id ? { ...subscription, autoRenewal } : subscription
    ),
    nextPaymentAt: autoRenewal ? tail.expiresAt : null,
  }
}

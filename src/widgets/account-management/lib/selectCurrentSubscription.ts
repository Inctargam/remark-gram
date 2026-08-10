import type { AccountStatus } from '@/entities/subscription'

import type { CurrentSubscriptionInfo } from '../model/types'

/**
 * What the `Current Subscription` block shows for a queue of subscriptions.
 *
 * The expiry date is taken from the last item, not the first: when a second subscription is
 * bought on top of an active one (UC-3), access ends when the queue ends. `nextPaymentAt`
 * is account-level and already `null` when auto-renewal is off.
 */
export const selectCurrentSubscription = (
  status: AccountStatus | undefined
): CurrentSubscriptionInfo | null => {
  const queueTail = status?.subscriptions.at(-1)

  if (!queueTail) {
    return null
  }

  return {
    expiresAt: queueTail.expiresAt,
    nextPaymentAt: status?.nextPaymentAt ?? null,
  }
}

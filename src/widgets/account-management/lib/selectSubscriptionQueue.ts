import type { AccountStatus } from '@/entities/subscription'

import type { SubscriptionQueueItem } from '../model/types'

/**
 * Rows of the `Current Subscription` block: one per subscription, oldest first.
 *
 * Buying on top of an active subscription (UC-3) appends to the queue instead of replacing
 * it, so the block shows the current one and the one waiting behind it. Only the tail can be
 * charged again, hence `nextPaymentAt` on the last row alone — it is account-level and
 * already `null` when auto-renewal is off.
 */
export const selectSubscriptionQueue = (
  status: AccountStatus | undefined
): SubscriptionQueueItem[] => {
  const subscriptions = status?.subscriptions ?? []

  return subscriptions.map((subscription, index) => ({
    id: subscription.id,
    expiresAt: subscription.expiresAt,
    nextPaymentAt: index === subscriptions.length - 1 ? (status?.nextPaymentAt ?? null) : null,
  }))
}

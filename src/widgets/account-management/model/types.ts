/** One row of the `Current Subscription` block — a single subscription of the queue. */
export type SubscriptionQueueItem = {
  id: string
  expiresAt: string
  /** Set on the queue tail only, and `null` there too when auto-renewal is off. */
  nextPaymentAt: string | null
}

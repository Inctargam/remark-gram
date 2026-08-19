/**
 * Subscription shapes are maintained by hand: the backend exposes no payments or
 * subscriptions endpoints yet (checked against `https://remark-gram.com/api/v1/docs-json`).
 * When they appear in `schema.d.ts`, replace these with generated types —
 * see TODO(subscriptions-schema) in `subscriptionsApi.ts`.
 */
export type AccountType = 'personal' | 'business'

/**
 * The payment provider is a parameter of the whole buy flow, not a separate branch:
 * adding PayPal means adding a member here and a button, nothing else.
 */
export type PaymentProvider = 'stripe' | 'paypal'

/** A plan is identified by its period — there is exactly one plan per period. */
export type SubscriptionPeriod = 'day' | 'week' | 'month'

export type Subscription = {
  id: string
  planId: SubscriptionPeriod
  /** ISO 8601 */
  startsAt: string
  expiresAt: string
  /**
   * Only the last subscription of the queue may carry `true` — the invariant is enforced
   * server-side (in the mock store for now), the UI just renders what it receives.
   */
  autoRenewal: boolean
  provider: PaymentProvider
}

export type AccountStatus = {
  accountType: AccountType
  /** Ascending by `startsAt`: the first item is the current one, the last is the queue tail. */
  subscriptions: Subscription[]
  /** When the tail renews, or `null` when auto-renewal is off or there is no subscription. */
  nextPaymentAt: string | null
}

/** Result of a checkout session — the two outcomes the return page has to render. */
export type CheckoutOutcome = 'success' | 'failed'

export type CheckoutSession = {
  id: string
  planId: SubscriptionPeriod
  provider: PaymentProvider
  /** Set once the payment service reports back; a completed session cannot be replayed. */
  outcome: CheckoutOutcome | null
  createdAt: string
}

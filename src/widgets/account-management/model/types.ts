export type CurrentSubscriptionInfo = {
  /** End of the whole queue: the moment the paid access actually stops. */
  expiresAt: string
  /** `null` when auto-renewal is off — there is no next charge to show. */
  nextPaymentAt: string | null
}

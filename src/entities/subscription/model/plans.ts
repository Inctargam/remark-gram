import type { SubscriptionPeriod } from './types'

/**
 * Plan catalogue. Neither the spec nor the backend defines the plans, so the set and the
 * prices are placeholders kept in one place — when the design or the backend says otherwise,
 * this array is the only thing that changes.
 *
 * Prices are in cents so no money value is ever a float.
 */
export type SubscriptionPlan = {
  id: SubscriptionPeriod
  priceCents: number
  /** Length of the paid period; the mock store derives `expiresAt` from it. */
  durationDays: number
  /** Shown in the plan picker, e.g. `$10 per 1 Day`. */
  label: string
}

export const SUBSCRIPTION_PLANS: readonly SubscriptionPlan[] = [
  { id: 'day', priceCents: 1000, durationDays: 1, label: '$10 per 1 Day' },
  { id: 'week', priceCents: 5000, durationDays: 7, label: '$50 per 7 Day' },
  { id: 'month', priceCents: 10000, durationDays: 30, label: '$100 per month' },
]

export const DEFAULT_SUBSCRIPTION_PLAN_ID: SubscriptionPeriod = SUBSCRIPTION_PLANS[0].id

/**
 * The period on its own, as the payments table prints it (`Subscription Type` column).
 * Separate from `SubscriptionPlan.label`, which also carries the price.
 */
export const SUBSCRIPTION_PERIOD_LABELS: Record<SubscriptionPeriod, string> = {
  day: '1 day',
  week: '7 days',
  month: '1 month',
}

export const findSubscriptionPlan = (planId: string): SubscriptionPlan | null =>
  SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) ?? null

/** `1000` → `$10`, `1050` → `$10.50`. Whole dollars stay short, as in the design. */
export const formatPriceCents = (priceCents: number): string => {
  const dollars = priceCents / 100

  return `$${Number.isInteger(dollars) ? dollars : dollars.toFixed(2)}`
}

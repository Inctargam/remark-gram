import type { PaymentProvider, SubscriptionPeriod } from '@/entities/subscription'

/**
 * One row of the `My payments` table. Hand-written for the same reason as the subscription
 * types — see TODO(subscriptions-schema) in `entities/subscription/api/subscriptionsApi.ts`.
 */
export type Payment = {
  id: string
  /** ISO 8601 */
  dateOfPayment: string
  endDateOfSubscription: string
  /** Cents, formatted for display by `formatPriceCents`. */
  priceCents: number
  subscriptionType: SubscriptionPeriod
  paymentType: PaymentProvider
}

/**
 * Offset pagination, unlike the cursor pagination of the posts feed: `Pagination` from the
 * UI kit works with page numbers and the user may jump to any page.
 */
export type PaymentsPage = {
  items: Payment[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

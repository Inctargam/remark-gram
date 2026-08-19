import type { PaymentProvider } from '@/entities/subscription'

/**
 * How the provider is spelled in the `Payment Type` column of the payments table —
 * the brand casing of the design, not the raw api value.
 */
export const PAYMENT_PROVIDER_LABELS: Record<PaymentProvider, string> = {
  paypal: 'PayPal',
  stripe: 'Stripe',
}

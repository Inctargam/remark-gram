import type { CheckoutOutcome } from '@/entities/subscription'

/**
 * How the payment service stub reports back: it sends the user to `returnUrl` with this
 * query param set. Both sides of the round trip read the name from here — the account tab
 * that parses it and the stub page that appends it.
 */
export const PAYMENT_RESULT_PARAM = 'payment'

const CHECKOUT_OUTCOMES: CheckoutOutcome[] = ['success', 'failed']

/** Anything the user may have typed into the url by hand is treated as "no result". */
export const parseCheckoutOutcome = (value: string | null | undefined): CheckoutOutcome | null =>
  CHECKOUT_OUTCOMES.find((outcome) => outcome === value) ?? null

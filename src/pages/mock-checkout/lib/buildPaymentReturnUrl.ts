import type { CheckoutOutcome } from '@/entities/subscription'
import { PAYMENT_RESULT_PARAM } from '@/features/buy-subscription'

type Params = {
  /** Comes from the query string, so it is untrusted input. */
  returnUrl: string
  outcome: CheckoutOutcome
  /** Origin of the app; anything pointing elsewhere is rejected. */
  origin: string
  /** Used when `returnUrl` is missing or points off-origin. */
  fallbackPath: string
}

/** `null` for an unparsable or off-origin value — the caller then uses its fallback. */
const toSameOriginUrl = (returnUrl: string, origin: string): URL | null => {
  if (!returnUrl) {
    return null
  }

  try {
    const url = new URL(returnUrl, origin)

    return url.origin === new URL(origin).origin ? url : null
  } catch {
    return null
  }
}

/**
 * Builds the url the stub sends the user back to, with the outcome attached.
 *
 * `returnUrl` is taken from the query string, so an off-origin value would turn this page
 * into an open redirect. Only same-origin targets are honoured, everything else falls back
 * to the settings page.
 */
export const buildPaymentReturnUrl = ({
  returnUrl,
  outcome,
  origin,
  fallbackPath,
}: Params): string => {
  const target = toSameOriginUrl(returnUrl, origin) ?? new URL(fallbackPath, origin)

  target.searchParams.set(PAYMENT_RESULT_PARAM, outcome)

  return target.toString()
}

'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import type { CheckoutOutcome } from '@/entities/subscription'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'

import { useCompleteCheckoutMutation } from '../api/useCompleteCheckoutMutation'
import { buildPaymentReturnUrl } from '../lib/buildPaymentReturnUrl'
import styles from './mockCheckout.module.css'

/**
 * `returnUrl` is normally the settings tab the checkout was started from — this only
 * covers the edge case where the query string had none or an off-origin one (Б2/этап 7).
 */
const SUBSCRIPTIONS_TAB_FALLBACK = `${ROUTES.settings}?part=subscriptions`

/**
 * Stand-in for the hosted page of a payment service (Р1): no Stripe SDK, no keys. It reports
 * the outcome the tester picks back to the mock API and returns the browser to `returnUrl`.
 * Deleted together with the mock API once real payments exist.
 */
export const MockCheckoutPage = () => {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('sessionId') ?? ''
  const returnUrl = searchParams?.get('returnUrl') ?? ''

  const { isPending, mutate } = useCompleteCheckoutMutation()
  /**
   * `isPending` alone settles as soon as the response lands, but the actual exit is the
   * `window.location.assign` in `onSettled` — a real navigation that can lag behind on a
   * slow connection. Stays true once either button is clicked so both stay locked (and
   * don't fire a second, conflicting outcome) for the whole click-to-navigate window.
   */
  const [isFinished, setIsFinished] = useState(false)

  const finishHandler = (outcome: CheckoutOutcome) => {
    // `disabled` on the buttons lags a render behind this state, so a click fired before
    // that commit would otherwise still reach here — guard the logic itself.
    if (isFinished) {
      return
    }

    setIsFinished(true)

    mutate(
      { sessionId, outcome },
      {
        // A replayed or unknown session answers with an error, and that is a failed
        // payment for the user — hence one exit path for both.
        onSettled: (result) => {
          window.location.assign(
            buildPaymentReturnUrl({
              returnUrl,
              outcome: result?.outcome ?? 'failed',
              origin: window.location.origin,
              fallbackPath: SUBSCRIPTIONS_TAB_FALLBACK,
            })
          )
        },
      }
    )
  }

  if (!sessionId) {
    return (
      <Card className={styles.card}>
        <h1 className={styles.title}>Payment service</h1>
        <p className={styles.message}>This page opens only from a checkout session.</p>
        <Link className={styles.link} href={SUBSCRIPTIONS_TAB_FALLBACK}>
          Back to settings
        </Link>
      </Card>
    )
  }

  return (
    <Card className={styles.card}>
      <h1 className={styles.title}>Payment service</h1>
      <p className={styles.message}>
        A stand-in for the external payment page. Pick how this payment ends.
      </p>
      <p className={styles.session}>Session: {sessionId}</p>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="outline"
          disabled={isPending || isFinished}
          onClick={() => finishHandler('failed')}>
          Cancel
        </Button>
        <Button
          type="button"
          disabled={isPending || isFinished}
          onClick={() => finishHandler('success')}>
          Pay
        </Button>
      </div>
    </Card>
  )
}

'use client'

import { useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { paymentsQueryKeys } from '@/entities/payment'
import type { CheckoutOutcome, PaymentProvider, SubscriptionPeriod } from '@/entities/subscription'
import { subscriptionQueryKeys } from '@/entities/subscription'

import { useCreateCheckoutSessionMutation } from '../api/useCreateCheckoutSessionMutation'
import { parseCheckoutOutcome, PAYMENT_RESULT_PARAM } from './paymentResult'

type Params = {
  planId: SubscriptionPeriod
}

export type BuySubscriptionState = {
  /** Non-null while the consent modal is open — it also carries the provider being paid with. */
  consentProvider: PaymentProvider | null
  isCheckoutPending: boolean
  paymentResult: CheckoutOutcome | null
  cancelPayment: () => void
  closePaymentResult: () => void
  confirmPayment: () => void
  startPayment: (provider: PaymentProvider) => void
}

/**
 * The payment service is left and re-entered through the url, so the return leg is
 * not state but a query param: the browser does a full page load coming back, and any
 * in-memory flag would be gone by then.
 */
const buildReturnUrl = () => {
  const url = new URL(window.location.href)

  // The tab may already show a result — the next round trip must not inherit it.
  url.searchParams.delete(PAYMENT_RESULT_PARAM)

  return url.toString()
}

/**
 * UC-1 steps 10-13: consent, checkout session, redirect to the payment service and the
 * result the service sends back. The provider is a parameter (Р4), so PayPal reuses all of it.
 */
export const useBuySubscription = ({ planId }: Params): BuySubscriptionState => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const [consentProvider, setConsentProvider] = useState<PaymentProvider | null>(null)
  /**
   * The dismissed value rather than a boolean: `router.replace` is not instant, so until the
   * url loses the param the closed modal has to be recognised by what it was showing.
   */
  const [dismissedResult, setDismissedResult] = useState<CheckoutOutcome | null>(null)
  const [hasCheckoutFailed, setHasCheckoutFailed] = useState(false)
  const { isPending, mutate } = useCreateCheckoutSessionMutation()

  const outcomeFromUrl = parseCheckoutOutcome(searchParams?.get(PAYMENT_RESULT_PARAM))

  useEffect(() => {
    if (outcomeFromUrl !== 'success') {
      return
    }

    // Coming back from the payment service is a full page load, so the cache is usually
    // cold already. Invalidating anyway keeps the tab right if it ever returns client-side.
    queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.all })
    queryClient.invalidateQueries({ queryKey: paymentsQueryKeys.all })
  }, [outcomeFromUrl, queryClient])

  const startPayment = (provider: PaymentProvider) => {
    setHasCheckoutFailed(false)
    setConsentProvider(provider)
  }

  /** Closing the modal by the cross or the backdrop is a cancel: no payment is created. */
  const cancelPayment = () => setConsentProvider(null)

  const confirmPayment = () => {
    if (!consentProvider) {
      return
    }

    mutate(
      { planId, provider: consentProvider, returnUrl: buildReturnUrl() },
      {
        // A real provider hosts its page on its own domain, so this is a full navigation
        // and not a router push — the app is genuinely left behind.
        onSuccess: ({ checkoutUrl }) => window.location.assign(checkoutUrl),
        onError: () => {
          setConsentProvider(null)
          setHasCheckoutFailed(true)
        },
      }
    )
  }

  const closePaymentResult = () => {
    setHasCheckoutFailed(false)
    setDismissedResult(outcomeFromUrl)

    // Drop only the result, not the whole query: the settings shell needs `part` to stay
    // on this tab, otherwise the next server render falls back to the default one.
    const remainingParams = new URLSearchParams(searchParams?.toString())
    remainingParams.delete(PAYMENT_RESULT_PARAM)
    const query = remainingParams.toString()

    router.replace(`${pathname ?? window.location.pathname}${query ? `?${query}` : ''}`)
  }

  const resultFromUrl = outcomeFromUrl === dismissedResult ? null : outcomeFromUrl

  return {
    consentProvider,
    isCheckoutPending: isPending,
    // A session that could not even be created is the same failure to the user as a
    // declined payment, so it renders through the very same modal.
    paymentResult: hasCheckoutFailed ? 'failed' : resultFromUrl,
    cancelPayment,
    closePaymentResult,
    confirmPayment,
    startPayment,
  }
}

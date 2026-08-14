'use client'

import { useMutation } from '@tanstack/react-query'

import type { CheckoutOutcome } from '@/entities/subscription'
import { completeCheckoutSession } from '@/entities/subscription'

type CompleteCheckoutVariables = {
  sessionId: string
  outcome: CheckoutOutcome
}

/**
 * What the payment service would report server-to-server. Here the stub page does it from
 * the browser, because there is no service — see Р1 in the roadmap.
 */
export const useCompleteCheckoutMutation = () =>
  useMutation({
    mutationFn: ({ sessionId, outcome }: CompleteCheckoutVariables) =>
      completeCheckoutSession(sessionId, outcome),
  })

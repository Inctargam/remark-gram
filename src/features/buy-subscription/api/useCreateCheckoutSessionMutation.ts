'use client'

import { useMutation } from '@tanstack/react-query'

import type { CreateCheckoutSessionPayload } from '@/entities/subscription'
import { createCheckoutSession } from '@/entities/subscription'

/**
 * UC-1 step 11: the app asks the payment service for a session and gets back the url the
 * browser has to be sent to. Nothing is cached — a session is single-use by design.
 */
export const useCreateCheckoutSessionMutation = () =>
  useMutation({
    mutationFn: (payload: CreateCheckoutSessionPayload) => createCheckoutSession(payload),
  })

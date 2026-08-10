'use client'

import { useState } from 'react'

import type { AccountType, SubscriptionPeriod } from '@/entities/subscription'
import { DEFAULT_SUBSCRIPTION_PLAN_ID, useCurrentSubscriptionQuery } from '@/entities/subscription'

import { selectSubscriptionQueue } from '../lib/selectSubscriptionQueue'
import type { SubscriptionQueueItem } from './types'

export type AccountManagementState = {
  accountType: AccountType
  errorMessage: string | null
  /** `true` while the tail of the queue renews — the state of the UC-2 checkbox. */
  isAutoRenewalOn: boolean
  isLoading: boolean
  isPersonalDisabled: boolean
  selectedPlanId: SubscriptionPeriod
  subscriptionQueue: SubscriptionQueueItem[]
  setAccountType: (accountType: AccountType) => void
  setSelectedPlanId: (planId: SubscriptionPeriod) => void
}

const LOAD_ERROR_MESSAGE = 'Failed to load subscription data. Please try again.'

/**
 * Switching to `Business` is a local choice until it is paid for: the server only learns
 * about it once a payment goes through. Hence the picked type overrides the fetched one
 * instead of being copied into state by an effect.
 */
export const useAccountManagement = (): AccountManagementState => {
  const { data, error, isPending } = useCurrentSubscriptionQuery()
  const [pickedAccountType, setPickedAccountType] = useState<AccountType | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPeriod>(
    DEFAULT_SUBSCRIPTION_PLAN_ID
  )

  const subscriptionQueue = selectSubscriptionQueue(data)

  return {
    accountType: pickedAccountType ?? data?.accountType ?? 'personal',
    errorMessage: error ? LOAD_ERROR_MESSAGE : null,
    // Only the tail may renew (Р5), so its flag is the one the checkbox shows.
    isAutoRenewalOn: data?.subscriptions.at(-1)?.autoRenewal ?? false,
    isLoading: isPending,
    // Downgrading a paid account back to personal is done by the backend when the
    // subscription runs out, so the option stays locked while one is active.
    isPersonalDisabled: subscriptionQueue.length > 0,
    selectedPlanId,
    subscriptionQueue,
    setAccountType: setPickedAccountType,
    setSelectedPlanId,
  }
}

'use client'

import { useState } from 'react'

import type { AccountType, SubscriptionPeriod } from '@/entities/subscription'
import { DEFAULT_SUBSCRIPTION_PLAN_ID, useCurrentSubscriptionQuery } from '@/entities/subscription'

import { selectCurrentSubscription } from '../lib/selectCurrentSubscription'
import type { CurrentSubscriptionInfo } from './types'

export type AccountManagementState = {
  accountType: AccountType
  currentSubscription: CurrentSubscriptionInfo | null
  errorMessage: string | null
  isLoading: boolean
  isPersonalDisabled: boolean
  selectedPlanId: SubscriptionPeriod
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

  const currentSubscription = selectCurrentSubscription(data)

  return {
    accountType: pickedAccountType ?? data?.accountType ?? 'personal',
    currentSubscription,
    errorMessage: error ? LOAD_ERROR_MESSAGE : null,
    isLoading: isPending,
    // Downgrading a paid account back to personal is done by the backend when the
    // subscription runs out, so the option stays locked while one is active.
    isPersonalDisabled: currentSubscription !== null,
    selectedPlanId,
    setAccountType: setPickedAccountType,
    setSelectedPlanId,
  }
}

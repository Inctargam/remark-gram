'use client'

import { useQuery } from '@tanstack/react-query'

import { subscriptionQueryKeys } from './queryKeys'
import { getCurrentSubscription } from './subscriptionsApi'

/**
 * Account type plus the queue of subscriptions. Every screen that shows subscription state
 * reads it from here, so a successful payment only has to invalidate one key.
 */
export const useCurrentSubscriptionQuery = () =>
  useQuery({
    queryKey: subscriptionQueryKeys.current(),
    queryFn: getCurrentSubscription,
  })

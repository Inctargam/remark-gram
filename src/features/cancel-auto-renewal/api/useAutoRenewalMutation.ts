'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { AccountStatus } from '@/entities/subscription'
import { setAutoRenewal, subscriptionQueryKeys } from '@/entities/subscription'

import { applyAutoRenewal } from '../model/applyAutoRenewal'

type AutoRenewalContext = {
  previousStatus: AccountStatus | undefined
}

/**
 * UC-2: the checkbox flips right away and rolls back if the request fails — a switch that
 * waits for a round trip before moving reads as a broken control.
 */
export const useAutoRenewalMutation = () => {
  const queryClient = useQueryClient()
  const queryKey = subscriptionQueryKeys.current()

  return useMutation<AccountStatus, Error, boolean, AutoRenewalContext>({
    mutationFn: (autoRenewal: boolean) => setAutoRenewal(autoRenewal),
    onMutate: async (autoRenewal) => {
      // An in-flight fetch would land after the optimistic write and undo it.
      await queryClient.cancelQueries({ queryKey })

      const previousStatus = queryClient.getQueryData<AccountStatus>(queryKey)

      if (previousStatus) {
        queryClient.setQueryData(queryKey, applyAutoRenewal(previousStatus, autoRenewal))
      }

      return { previousStatus }
    },
    onError: (_error, _autoRenewal, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(queryKey, context.previousStatus)
      }
    },
    // The server answers with the whole status, but a refetch also covers the rollback path.
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })
}

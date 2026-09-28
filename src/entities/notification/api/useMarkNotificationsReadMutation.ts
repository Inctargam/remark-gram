'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { MarkNotificationsReadPayload } from './notificationsApi'
import { markNotificationsReadRequest } from './notificationsApi'
import type { NotificationsInfiniteData } from './notificationsCache'
import { markNotificationsReadInCache } from './notificationsCache'
import { notificationQueryKeys } from './queryKeys'

export const useMarkNotificationsReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: MarkNotificationsReadPayload) => markNotificationsReadRequest(payload),
    onMutate: async (payload) => {
      const readAt = new Date().toISOString()
      const previousQueries = queryClient.getQueriesData<NotificationsInfiniteData>({
        queryKey: notificationQueryKeys.lists(),
      })
      const idsToMark = payload.all ? undefined : (payload.ids ?? [])

      await queryClient.cancelQueries({ queryKey: notificationQueryKeys.lists() })
      queryClient.setQueriesData<NotificationsInfiniteData>(
        { queryKey: notificationQueryKeys.lists() },
        (data) => markNotificationsReadInCache(data, readAt, idsToMark)
      )

      return { previousQueries }
    },
    onError: (_error, _payload, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists() })
    },
  })
}

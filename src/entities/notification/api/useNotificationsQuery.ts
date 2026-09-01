'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { getNotifications, NOTIFICATIONS_PAGE_SIZE } from './notificationsApi'
import { notificationQueryKeys } from './queryKeys'

export const NOTIFICATIONS_INITIAL_PAGE_PARAM = null

/**
 * Header notification history is cursor-paginated newest first. The hook keeps transport
 * details out of widgets; they receive already normalized notification pages.
 */
export const useNotificationsQuery = (limit: number = NOTIFICATIONS_PAGE_SIZE) =>
  useInfiniteQuery({
    queryKey: notificationQueryKeys.list(limit),
    queryFn: ({ pageParam }) => getNotifications({ cursor: pageParam, limit }),
    initialPageParam: NOTIFICATIONS_INITIAL_PAGE_PARAM as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

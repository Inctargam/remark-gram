'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

import {
  NOTIFICATIONS_PAGE_SIZE,
  useMarkNotificationsReadMutation,
  useNotificationsQuery,
} from '@/entities/notification'

import { flattenNotificationPages, getNotificationsBadgeCount } from '../lib/notificationsView'
import { shouldMarkNotificationsReadOnOpen } from './notificationsReadState'

export const useNotificationsMenu = () => {
  const pathname = usePathname()
  const [openPathname, setOpenPathname] = useState<string | null>(null)
  const notificationsQuery = useNotificationsQuery(NOTIFICATIONS_PAGE_SIZE)
  const { isPending: isMarkingNotificationsRead, mutate: markNotificationsRead } =
    useMarkNotificationsReadMutation()
  const pages = notificationsQuery.data?.pages
  const notifications = flattenNotificationPages(pages)
  const unreadCount = getNotificationsBadgeCount(pages)
  const hasUnreadNotifications = unreadCount > 0
  const badgeLabel = unreadCount > 99 ? '99+' : String(unreadCount)
  const isOpen = openPathname === pathname

  const openChangeHandler = (nextOpen: boolean) => {
    if (
      shouldMarkNotificationsReadOnOpen({
        hasUnreadNotifications,
        isMarkingNotificationsRead,
        isOpen: nextOpen,
        readWasRequestedForCurrentOpen: false,
      })
    ) {
      markNotificationsRead({ all: true })
    }

    setOpenPathname(nextOpen ? pathname : null)
  }

  const loadMoreHandler = () => {
    if (!notificationsQuery.hasNextPage || notificationsQuery.isFetchingNextPage) {
      return
    }

    void notificationsQuery.fetchNextPage()
  }

  return {
    badgeLabel,
    hasUnreadNotifications,
    isOpen,
    loadMoreHandler,
    notifications,
    notificationsQuery,
    openChangeHandler,
  }
}

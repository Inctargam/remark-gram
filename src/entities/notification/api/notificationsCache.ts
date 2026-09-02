import type { InfiniteData } from '@tanstack/react-query'

import type { NotificationEvent, NotificationPage } from '../model/notification'
import { mapNotificationEvent, markNotificationsRead } from '../model/notification'

export type NotificationsInfiniteData = InfiniteData<NotificationPage, string | null>

/**
 * Realtime events arrive outside the history request. This helper keeps the cached first
 * page newest-first and idempotent while the next backend contract is still unknown.
 */
export const prependNotificationEventToCache = (
  data: NotificationsInfiniteData | undefined,
  event: NotificationEvent
): NotificationsInfiniteData => {
  const notification = mapNotificationEvent(event)

  if (!data) {
    return {
      pageParams: [null],
      pages: [{ items: [notification], nextCursor: null }],
    }
  }

  const isAlreadyCached = data.pages.some((page) =>
    page.items.some(({ id }) => id === notification.id)
  )

  if (isAlreadyCached) {
    return data
  }

  const [firstPage, ...restPages] = data.pages

  if (!firstPage) {
    return {
      ...data,
      pageParams: data.pageParams.length > 0 ? data.pageParams : [null],
      pages: [{ items: [notification], nextCursor: null }],
    }
  }

  return {
    ...data,
    pages: [{ ...firstPage, items: [notification, ...firstPage.items] }, ...restPages],
  }
}

export const markNotificationsReadInCache = (
  data: NotificationsInfiniteData | undefined,
  readAt: string,
  ids?: readonly string[]
): NotificationsInfiniteData | undefined => {
  if (!data) {
    return data
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: markNotificationsRead(page.items, readAt, ids),
    })),
  }
}

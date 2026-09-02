import { describe, expect, it } from 'vitest'

import type { NotificationsInfiniteData } from './notificationsCache'
import { prependNotificationEventToCache } from './notificationsCache'

const liveEvent = {
  id: 'notification-live',
  kind: 'nextPayment',
  createdAt: '2026-09-01T12:30:00.000Z',
} as const

const cachedData: NotificationsInfiniteData = {
  pageParams: [null],
  pages: [
    {
      items: [
        {
          id: 'notification-existing',
          kind: 'subscriptionExpires',
          message: 'Ваша подписка истекает через 1 день',
          createdAt: '2026-09-01T12:00:00.000Z',
          readAt: null,
          payload: { daysLeft: 1 },
        },
      ],
      nextCursor: null,
    },
  ],
}

describe('prependNotificationEventToCache', () => {
  it('creates the first infinite-query page when no cache exists yet', () => {
    const data = prependNotificationEventToCache(undefined, liveEvent)

    expect(data.pageParams).toEqual([null])
    expect(data.pages[0]?.items[0]?.id).toBe('notification-live')
  })

  it('prepends a realtime event to the first cached page', () => {
    const data = prependNotificationEventToCache(cachedData, liveEvent)

    expect(data.pages[0]?.items.map(({ id }) => id)).toEqual([
      'notification-live',
      'notification-existing',
    ])
  })

  it('ignores duplicate realtime events', () => {
    const once = prependNotificationEventToCache(cachedData, liveEvent)
    const twice = prependNotificationEventToCache(once, liveEvent)

    expect(twice.pages[0]?.items.map(({ id }) => id)).toEqual([
      'notification-live',
      'notification-existing',
    ])
  })
})

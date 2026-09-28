import { describe, expect, it } from 'vitest'

import type { NotificationPage } from '@/entities/notification'

import {
  flattenNotificationPages,
  formatNotificationTime,
  getNotificationsBadgeCount,
} from './notificationsView'

const page: NotificationPage = {
  items: [
    {
      id: 'notification-1',
      kind: 'nextPayment',
      message: 'Следующий платеж у вас спишется через 1 день',
      createdAt: '2026-09-01T12:00:00.000Z',
      readAt: null,
      payload: {},
    },
    {
      id: 'notification-2',
      kind: 'subscriptionExpires',
      message: 'Ваша подписка истекает через 7 дней',
      createdAt: '2026-09-01T11:00:00.000Z',
      readAt: '2026-09-01T12:05:00.000Z',
      payload: { daysLeft: 7 },
    },
  ],
  nextCursor: null,
}

describe('flattenNotificationPages', () => {
  it('flattens notification pages in order', () => {
    expect(flattenNotificationPages([page]).map(({ id }) => id)).toEqual([
      'notification-1',
      'notification-2',
    ])
  })

  it('ignores missing pages and malformed empty items', () => {
    const malformedPage = {
      ...page,
      items: [page.items[0], undefined],
    } as unknown as NotificationPage

    expect(flattenNotificationPages([undefined, malformedPage]).map(({ id }) => id)).toEqual([
      'notification-1',
    ])
  })

  it('treats pages without items as empty pages', () => {
    const malformedPage = { nextCursor: null } as unknown as NotificationPage

    expect(flattenNotificationPages([malformedPage])).toEqual([])
  })
})

describe('getNotificationsBadgeCount', () => {
  it('counts unread notifications from cached pages', () => {
    expect(getNotificationsBadgeCount([page])).toBe(1)
  })
})

describe('formatNotificationTime', () => {
  it('formats notification time in UTC to keep SSR and client stable', () => {
    expect(formatNotificationTime('2026-09-01T12:05:00.000Z')).toBe('01.09, 12:05')
  })

  it('returns an empty string for invalid dates', () => {
    expect(formatNotificationTime('nope')).toBe('')
  })
})

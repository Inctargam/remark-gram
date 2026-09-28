import { describe, expect, it } from 'vitest'

import type { Notification } from './notification'
import {
  buildNotificationMessage,
  countUnreadNotifications,
  mapNotificationEvent,
  markNotificationsRead,
  selectLastMonthNotifications,
} from './notification'

const unreadNotification = (id: string, createdAt = '2026-09-01T10:00:00.000Z'): Notification => ({
  id,
  kind: 'nextPayment',
  message: 'Следующий платеж у вас спишется через 1 день',
  createdAt,
  readAt: null,
  payload: {},
})

describe('buildNotificationMessage', () => {
  it('formats a subscription activation message with the end date', () => {
    expect(
      buildNotificationMessage('subscriptionActivated', {
        expiresAt: '2026-09-30T23:59:59.000Z',
      })
    ).toBe('Ваша подписка активирована и действует до 30.09.2026')
  })

  it('formats the next payment message', () => {
    expect(buildNotificationMessage('nextPayment')).toBe(
      'Следующий платеж у вас спишется через 1 день'
    )
  })

  it('formats a seven-day subscription expiry message', () => {
    expect(buildNotificationMessage('subscriptionExpires', { daysLeft: 7 })).toBe(
      'Ваша подписка истекает через 7 дней'
    )
  })

  it('formats a one-day subscription expiry message', () => {
    expect(buildNotificationMessage('subscriptionExpires', { daysLeft: 1 })).toBe(
      'Ваша подписка истекает через 1 день'
    )
  })
})

describe('mapNotificationEvent', () => {
  it('keeps a backend-provided message when it is present', () => {
    expect(
      mapNotificationEvent({
        id: 'notification-1',
        kind: 'nextPayment',
        message: 'Server text',
        createdAt: '2026-09-01T10:00:00.000Z',
      }).message
    ).toBe('Server text')
  })

  it('builds a message for structured mock events', () => {
    expect(
      mapNotificationEvent({
        id: 'notification-1',
        kind: 'subscriptionExpires',
        createdAt: '2026-09-01T10:00:00.000Z',
        payload: { daysLeft: 7 },
      }).message
    ).toBe('Ваша подписка истекает через 7 дней')
  })
})

describe('countUnreadNotifications', () => {
  it('counts only notifications without readAt', () => {
    expect(
      countUnreadNotifications([
        unreadNotification('notification-1'),
        { ...unreadNotification('notification-2'), readAt: '2026-09-01T10:01:00.000Z' },
      ])
    ).toBe(1)
  })
})

describe('markNotificationsRead', () => {
  it('marks every unread notification when ids are omitted', () => {
    const readAt = '2026-09-01T10:05:00.000Z'

    expect(
      markNotificationsRead(
        [unreadNotification('notification-1'), unreadNotification('notification-2')],
        readAt
      )
    ).toEqual([
      { ...unreadNotification('notification-1'), readAt },
      { ...unreadNotification('notification-2'), readAt },
    ])
  })

  it('marks only selected notifications when ids are provided', () => {
    const readAt = '2026-09-01T10:05:00.000Z'

    expect(
      markNotificationsRead(
        [unreadNotification('notification-1'), unreadNotification('notification-2')],
        readAt,
        ['notification-2']
      )
    ).toEqual([
      unreadNotification('notification-1'),
      { ...unreadNotification('notification-2'), readAt },
    ])
  })
})

describe('selectLastMonthNotifications', () => {
  it('keeps notifications from the last month only', () => {
    expect(
      selectLastMonthNotifications(
        [
          unreadNotification('fresh', '2026-08-15T10:00:00.000Z'),
          unreadNotification('old', '2026-07-01T10:00:00.000Z'),
        ],
        new Date('2026-09-01T10:00:00.000Z')
      ).map(({ id }) => id)
    ).toEqual(['fresh'])
  })

  it('rejects notifications from the future', () => {
    expect(
      selectLastMonthNotifications(
        [unreadNotification('future', '2026-09-02T10:00:00.000Z')],
        new Date('2026-09-01T10:00:00.000Z')
      )
    ).toEqual([])
  })
})

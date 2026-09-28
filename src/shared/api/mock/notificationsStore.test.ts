import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  listNotifications,
  markNotificationsAsRead,
  prependNotification,
  resetNotificationsMockStore,
  scheduleSubscriptionActivatedNotification,
} from './notificationsStore'

const NOW_MS = Date.UTC(2026, 8, 1, 12, 0, 0)

beforeEach(() => {
  resetNotificationsMockStore()
})

afterEach(() => {
  resetNotificationsMockStore()
  vi.useRealTimers()
})

describe('listNotifications', () => {
  it('returns newest first and excludes notifications older than one month', () => {
    const page = listNotifications({ limit: 10, nowMs: NOW_MS })

    expect(page.items.map(({ id }) => id)).toEqual([
      'mock-notification-activation',
      'mock-notification-next-payment',
      'mock-notification-expires-7',
      'mock-notification-expires-1',
    ])
    expect(page.nextCursor).toBeNull()
  })

  it('uses cursor pagination', () => {
    const firstPage = listNotifications({ limit: 2, nowMs: NOW_MS })
    const secondPage = listNotifications({ cursor: firstPage.nextCursor, limit: 2, nowMs: NOW_MS })

    expect(firstPage.items.map(({ id }) => id)).toEqual([
      'mock-notification-activation',
      'mock-notification-next-payment',
    ])
    expect(firstPage.nextCursor).toBe('mock-notification-expires-7')
    expect(secondPage.items.map(({ id }) => id)).toEqual([
      'mock-notification-expires-7',
      'mock-notification-expires-1',
    ])
    expect(secondPage.nextCursor).toBeNull()
  })
})

describe('markNotificationsAsRead', () => {
  it('marks every notification as read for mark-all-on-open behavior', () => {
    const result = markNotificationsAsRead({
      all: true,
      readAt: '2026-09-01T12:05:00.000Z',
      nowMs: NOW_MS,
    })

    expect(result.unreadCount).toBe(0)
    expect(result.items.every(({ readAt }) => readAt !== null)).toBe(true)
  })

  it('marks selected notifications by id', () => {
    const result = markNotificationsAsRead({
      ids: ['mock-notification-next-payment'],
      readAt: '2026-09-01T12:05:00.000Z',
      nowMs: NOW_MS,
    })
    const notification = result.items.find(({ id }) => id === 'mock-notification-next-payment')

    expect(notification?.readAt).toBe('2026-09-01T12:05:00.000Z')
    expect(result.unreadCount).toBe(2)
  })

  it('does not mark anything when neither all nor ids are provided', () => {
    const result = markNotificationsAsRead({
      readAt: '2026-09-01T12:05:00.000Z',
      nowMs: NOW_MS,
    })

    expect(result.unreadCount).toBe(3)
  })
})

describe('prependNotification', () => {
  it('adds a realtime notification to the beginning of the list', () => {
    prependNotification({
      id: 'mock-notification-live',
      kind: 'nextPayment',
      createdAt: '2026-09-01T12:30:00.000Z',
    })

    expect(
      listNotifications({ limit: 1, nowMs: Date.UTC(2026, 8, 1, 13, 0, 0) }).items[0]?.id
    ).toBe('mock-notification-live')
  })
})

describe('scheduleSubscriptionActivatedNotification', () => {
  it('adds an activation notification after the configured delay', () => {
    vi.useFakeTimers()

    const notificationId = scheduleSubscriptionActivatedNotification({
      subscriptionId: 'subscription-1',
      expiresAt: '2026-09-30T12:00:00.000Z',
      delayMs: 1_000,
      nowMs: NOW_MS,
    })

    expect(listNotifications({ limit: 10, nowMs: NOW_MS }).items).not.toContainEqual(
      expect.objectContaining({ id: notificationId })
    )

    vi.advanceTimersByTime(1_000)

    expect(listNotifications({ limit: 1, nowMs: NOW_MS + 1_000 }).items[0]).toEqual(
      expect.objectContaining({
        id: notificationId,
        kind: 'subscriptionActivated',
        message: 'Ваша подписка активирована и действует до 30.09.2026',
        readAt: null,
      })
    )
  })

  it('does not schedule duplicate activation notifications for the same subscription', () => {
    vi.useFakeTimers()

    scheduleSubscriptionActivatedNotification({
      subscriptionId: 'subscription-1',
      expiresAt: '2026-09-30T12:00:00.000Z',
      delayMs: 1_000,
      nowMs: NOW_MS,
    })
    scheduleSubscriptionActivatedNotification({
      subscriptionId: 'subscription-1',
      expiresAt: '2026-09-30T12:00:00.000Z',
      delayMs: 1_000,
      nowMs: NOW_MS,
    })

    vi.advanceTimersByTime(1_000)

    expect(
      listNotifications({ limit: 10, nowMs: NOW_MS + 1_000 }).items.filter(
        ({ id }) => id === 'mock-notification-activation-subscription-1'
      )
    ).toHaveLength(1)
  })
})

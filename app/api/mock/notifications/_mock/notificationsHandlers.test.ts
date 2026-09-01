import { beforeEach, describe, expect, it } from 'vitest'

import type { NotificationPage } from '@/entities/notification'
import { resetNotificationsMockStore } from '@/shared/api/mock/notificationsStore'

import { getNotificationsHandler, markNotificationsReadHandler } from './notificationsHandlers'

const MOCK_API_ORIGIN = 'https://dev.remark-gram.com:3000/api/mock/notifications'

const createGetRequest = (search = '') => new Request(`${MOCK_API_ORIGIN}${search}`)

const createJsonRequest = (payload: unknown) =>
  new Request(`${MOCK_API_ORIGIN}/read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

beforeEach(() => {
  resetNotificationsMockStore()
})

describe('getNotificationsHandler', () => {
  it('returns a cursor page', async () => {
    const response = await getNotificationsHandler(createGetRequest('?limit=2'))
    const page: NotificationPage = await response.json()

    expect(response.status).toBe(200)
    expect(page.items).toHaveLength(2)
    expect(page.nextCursor).toBe('mock-notification-expires-7')
  })

  it('falls back to the default limit for an invalid limit', async () => {
    const response = await getNotificationsHandler(createGetRequest('?limit=nope'))
    const page: NotificationPage = await response.json()

    expect(page.items).toHaveLength(4)
  })
})

describe('markNotificationsReadHandler', () => {
  it('marks all notifications as read', async () => {
    const response = await markNotificationsReadHandler(createJsonRequest({ all: true }))
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.unreadCount).toBe(0)
  })

  it('rejects invalid ids', async () => {
    const response = await markNotificationsReadHandler(createJsonRequest({ ids: [1] }))

    expect(response.status).toBe(400)
  })

  it('requires all or ids', async () => {
    const response = await markNotificationsReadHandler(createJsonRequest({}))

    expect(response.status).toBe(400)
  })
})

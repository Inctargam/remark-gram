import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { NotificationPage } from '../model/notification'
import {
  getNotifications,
  markNotificationsReadRequest,
  NOTIFICATIONS_PAGE_SIZE,
} from './notificationsApi'

const notificationsPage: NotificationPage = {
  items: [
    {
      id: 'notification-1',
      kind: 'nextPayment',
      message: 'Следующий платеж у вас спишется через 1 день',
      createdAt: '2026-09-01T12:00:00.000Z',
      readAt: null,
      payload: {},
    },
  ],
  nextCursor: null,
}

const fetchMock = vi.fn()

/** Last URL the api module asked `fetch` for. */
const getRequestedUrl = () => String(fetchMock.mock.calls[0]?.[0])

const getRequestInit = () => fetchMock.mock.calls[0]?.[1] as RequestInit | undefined

const respondWith = (body: unknown, status = 200) => {
  fetchMock.mockImplementation(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      })
  )
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_NOTIFICATIONS_API_MOCK', 'true')
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('getNotifications', () => {
  it('asks for notifications with the default page size', async () => {
    respondWith(notificationsPage)

    await expect(getNotifications()).resolves.toEqual(notificationsPage)
    expect(getRequestedUrl()).toContain(`/api/mock/notifications?limit=${NOTIFICATIONS_PAGE_SIZE}`)
  })

  it('passes cursor and limit', async () => {
    respondWith(notificationsPage)

    await getNotifications({ cursor: 'notification-2', limit: 10 })

    expect(getRequestedUrl()).toContain('limit=10&cursor=notification-2')
  })

  it('targets the real backend path when the mock flag is off', async () => {
    vi.stubEnv('NEXT_PUBLIC_NOTIFICATIONS_API_MOCK', 'false')
    respondWith(notificationsPage)

    await getNotifications()

    expect(getRequestedUrl()).toContain('/api/v1/notifications?')
  })
})

describe('markNotificationsReadRequest', () => {
  it('posts the read payload to the mock read endpoint', async () => {
    respondWith({ unreadCount: 0 })

    await expect(markNotificationsReadRequest({ all: true })).resolves.toEqual({ unreadCount: 0 })

    expect(getRequestedUrl()).toContain('/api/mock/notifications/read')
    expect(getRequestInit()?.body).toBe(JSON.stringify({ all: true }))
  })
})

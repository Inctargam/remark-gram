import { QueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type {
  MockNotificationsRealtimeParams,
  NotificationsInfiniteData,
} from '@/entities/notification'
import { notificationQueryKeys, NOTIFICATIONS_PAGE_SIZE } from '@/entities/notification'

import { startNotificationsConnection } from './notificationsConnection'

const createQueryClient = () => new QueryClient()

afterEach(() => {
  vi.restoreAllMocks()
})

describe('startNotificationsConnection', () => {
  it('does not connect before the session is authenticated', () => {
    const connect = vi.fn()

    expect(
      startNotificationsConnection({
        accessToken: 'token',
        connect,
        queryClient: createQueryClient(),
        status: 'loading',
      })
    ).toBeUndefined()
    expect(connect).not.toHaveBeenCalled()
  })

  it('does not connect without an access token', () => {
    const connect = vi.fn()

    expect(
      startNotificationsConnection({
        accessToken: null,
        connect,
        queryClient: createQueryClient(),
        status: 'authenticated',
      })
    ).toBeUndefined()
    expect(connect).not.toHaveBeenCalled()
  })

  it('mirrors realtime events into notification query cache', () => {
    const queryClient = createQueryClient()
    const queryKey = notificationQueryKeys.list(NOTIFICATIONS_PAGE_SIZE)
    const cachedData: NotificationsInfiniteData = {
      pageParams: [null],
      pages: [{ items: [], nextCursor: null }],
    }
    const connect = vi.fn(({ onEvent }: MockNotificationsRealtimeParams) => {
      onEvent({
        id: 'notification-live',
        kind: 'nextPayment',
        createdAt: '2026-09-01T12:00:00.000Z',
      })

      return vi.fn()
    })

    queryClient.setQueryData(queryKey, cachedData)

    startNotificationsConnection({
      accessToken: 'token',
      connect,
      queryClient,
      status: 'authenticated',
    })

    expect(
      queryClient.getQueryData<NotificationsInfiniteData>(queryKey)?.pages[0]?.items[0]?.id
    ).toBe('notification-live')
  })

  it('returns the realtime cleanup function', () => {
    const cleanup = vi.fn()
    const connect = vi.fn(() => cleanup)
    const stop = startNotificationsConnection({
      accessToken: 'token',
      connect,
      queryClient: createQueryClient(),
      status: 'authenticated',
    })

    stop?.()

    expect(cleanup).toHaveBeenCalledOnce()
  })
})

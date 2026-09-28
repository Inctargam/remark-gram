import { beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  MarkNotificationsReadPayload,
  MarkNotificationsReadResponse,
} from './notificationsApi'
import type { NotificationsInfiniteData } from './notificationsCache'
import { notificationQueryKeys } from './queryKeys'
import { useMarkNotificationsReadMutation } from './useMarkNotificationsReadMutation'

const mocks = vi.hoisted(() => ({
  cancelQueries: vi.fn(),
  getQueriesData: vi.fn(),
  invalidateQueries: vi.fn(),
  markNotificationsReadRequest: vi.fn(),
  setQueriesData: vi.fn(),
  setQueryData: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useMutation: mocks.useMutation,
  useQueryClient: mocks.useQueryClient,
}))

vi.mock('./notificationsApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./notificationsApi')>()

  return {
    ...actual,
    markNotificationsReadRequest: mocks.markNotificationsReadRequest,
  }
})

type MutationContext = {
  previousQueries: Array<[readonly unknown[], NotificationsInfiniteData | undefined]>
}

type MutationOptions = {
  mutationFn: (payload: MarkNotificationsReadPayload) => Promise<MarkNotificationsReadResponse>
  onError: (
    error: Error,
    payload: MarkNotificationsReadPayload,
    context: MutationContext | undefined
  ) => void
  onMutate: (payload: MarkNotificationsReadPayload) => Promise<MutationContext>
  onSettled: () => void
}

const unreadNotification = {
  id: 'notification-unread',
  kind: 'nextPayment',
  message: 'Следующий платеж у вас спишется через 1 день',
  createdAt: '2026-09-04T12:00:00.000Z',
  readAt: null,
  payload: {},
} as const

const secondUnreadNotification = {
  id: 'notification-second',
  kind: 'subscriptionExpires',
  message: 'Ваша подписка истекает через 1 день',
  createdAt: '2026-09-04T11:00:00.000Z',
  readAt: null,
  payload: { daysLeft: 1 },
} as const

const cachedData: NotificationsInfiniteData = {
  pageParams: [null],
  pages: [
    {
      items: [unreadNotification, secondUnreadNotification],
      nextCursor: null,
    },
  ],
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-09-04T12:30:00.000Z'))
  mocks.cancelQueries.mockReset()
  mocks.getQueriesData.mockReset()
  mocks.invalidateQueries.mockReset()
  mocks.markNotificationsReadRequest.mockReset()
  mocks.setQueriesData.mockReset()
  mocks.setQueryData.mockReset()
  mocks.useMutation.mockReset()
  mocks.useQueryClient.mockReset()
  mocks.useMutation.mockImplementation((options) => options)
  mocks.useQueryClient.mockReturnValue({
    cancelQueries: mocks.cancelQueries,
    getQueriesData: mocks.getQueriesData,
    invalidateQueries: mocks.invalidateQueries,
    setQueriesData: mocks.setQueriesData,
    setQueryData: mocks.setQueryData,
  })
  mocks.getQueriesData.mockReturnValue([[notificationQueryKeys.list(20), cachedData]])
})

describe('useMarkNotificationsReadMutation', () => {
  it('posts through the notifications API adapter', async () => {
    mocks.markNotificationsReadRequest.mockResolvedValue({ unreadCount: 0 })
    const mutation = useMarkNotificationsReadMutation() as unknown as MutationOptions

    await expect(mutation.mutationFn({ all: true })).resolves.toEqual({ unreadCount: 0 })

    expect(mocks.markNotificationsReadRequest).toHaveBeenCalledWith({ all: true })
  })

  it('optimistically marks all cached notifications as read', async () => {
    const mutation = useMarkNotificationsReadMutation() as unknown as MutationOptions

    await mutation.onMutate({ all: true })

    const update = mocks.setQueriesData.mock.calls[0]?.[1] as (
      data: NotificationsInfiniteData | undefined
    ) => NotificationsInfiniteData | undefined
    const updatedData = update(cachedData)

    expect(mocks.cancelQueries).toHaveBeenCalledWith({ queryKey: notificationQueryKeys.lists() })
    expect(updatedData?.pages[0]?.items.map(({ readAt }) => readAt)).toEqual([
      '2026-09-04T12:30:00.000Z',
      '2026-09-04T12:30:00.000Z',
    ])
  })

  it('optimistically marks only selected cached notifications as read', async () => {
    const mutation = useMarkNotificationsReadMutation() as unknown as MutationOptions

    await mutation.onMutate({ ids: ['notification-second'] })

    const update = mocks.setQueriesData.mock.calls[0]?.[1] as (
      data: NotificationsInfiniteData | undefined
    ) => NotificationsInfiniteData | undefined
    const updatedData = update(cachedData)

    expect(updatedData?.pages[0]?.items[0]?.readAt).toBeNull()
    expect(updatedData?.pages[0]?.items[1]?.readAt).toBe('2026-09-04T12:30:00.000Z')
  })

  it('rolls optimistic cache changes back on error', async () => {
    const mutation = useMarkNotificationsReadMutation() as unknown as MutationOptions
    const context = await mutation.onMutate({ all: true })

    mutation.onError(new Error('request failed'), { all: true }, context)

    expect(mocks.setQueryData).toHaveBeenCalledWith(notificationQueryKeys.list(20), cachedData)
  })

  it('invalidates notification lists after the request settles', () => {
    const mutation = useMarkNotificationsReadMutation() as unknown as MutationOptions

    mutation.onSettled()

    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: notificationQueryKeys.lists(),
    })
  })
})

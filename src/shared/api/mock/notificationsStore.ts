import type { Notification, NotificationEvent, NotificationPage } from '@/entities/notification'
import {
  countUnreadNotifications,
  mapNotificationEvent,
  markNotificationsRead,
  selectLastMonthNotifications,
  SUBSCRIPTION_ACTIVATION_NOTIFICATION_DELAY_MS,
} from '@/entities/notification'

/**
 * In-memory notifications store for the mock API.
 * Kept on `globalThis` so manual dev checks survive hot reloads.
 */
const STORE_KEY = '__inctagramNotificationsMockStore'

type NotificationsStoreState = {
  /** Newest first — the order the header panel renders. */
  notifications: Notification[]
  scheduledNotificationTimers: Map<string, ReturnType<typeof globalThis.setTimeout>>
}

type GlobalWithNotificationsStore = typeof globalThis & {
  [STORE_KEY]?: NotificationsStoreState
}

const DAY_IN_MS = 24 * 60 * 60 * 1000
const SEED_BASE_TIME = Date.UTC(2026, 8, 1, 12, 0, 0)

const createSeedEvents = (): NotificationEvent[] => [
  {
    id: 'mock-notification-activation',
    kind: 'subscriptionActivated',
    createdAt: new Date(SEED_BASE_TIME).toISOString(),
    payload: { expiresAt: new Date(SEED_BASE_TIME + 30 * DAY_IN_MS).toISOString() },
  },
  {
    id: 'mock-notification-next-payment',
    kind: 'nextPayment',
    createdAt: new Date(SEED_BASE_TIME - DAY_IN_MS).toISOString(),
  },
  {
    id: 'mock-notification-expires-7',
    kind: 'subscriptionExpires',
    createdAt: new Date(SEED_BASE_TIME - 7 * DAY_IN_MS).toISOString(),
    readAt: new Date(SEED_BASE_TIME - 6 * DAY_IN_MS).toISOString(),
    payload: { daysLeft: 7 },
  },
  {
    id: 'mock-notification-expires-1',
    kind: 'subscriptionExpires',
    createdAt: new Date(SEED_BASE_TIME - 10 * DAY_IN_MS).toISOString(),
    payload: { daysLeft: 1 },
  },
  {
    id: 'mock-notification-too-old',
    kind: 'nextPayment',
    createdAt: new Date(SEED_BASE_TIME - 45 * DAY_IN_MS).toISOString(),
  },
]

const createSeedState = (): NotificationsStoreState => ({
  notifications: createSeedEvents().map(mapNotificationEvent),
  scheduledNotificationTimers: new Map(),
})

const getState = (): NotificationsStoreState => {
  const globalWithStore = globalThis as GlobalWithNotificationsStore

  globalWithStore[STORE_KEY] ??= createSeedState()

  return globalWithStore[STORE_KEY]
}

/** Test-only: brings the store back to its seeded state. */
export const resetNotificationsMockStore = () => {
  const globalWithStore = globalThis as GlobalWithNotificationsStore

  globalWithStore[STORE_KEY]?.scheduledNotificationTimers.forEach((timerId) => {
    globalThis.clearTimeout(timerId)
  })
  globalWithStore[STORE_KEY] = createSeedState()
}

export type ListNotificationsParams = {
  cursor?: string | null
  limit: number
  /** Injectable clock; defaults to now. */
  nowMs?: number
}

export const listNotifications = ({
  cursor = null,
  limit,
  nowMs = Date.now(),
}: ListNotificationsParams): NotificationPage => {
  const pageSize = Math.max(1, limit)
  const items = selectLastMonthNotifications(getState().notifications, new Date(nowMs))
  const cursorIndex = cursor ? items.findIndex(({ id }) => id === cursor) : -1
  const startIndex = cursorIndex >= 0 ? cursorIndex : 0
  const pageItems = items.slice(startIndex, startIndex + pageSize)
  const nextItem = items[startIndex + pageSize]

  return {
    items: pageItems.map((notification) => ({ ...notification })),
    nextCursor: nextItem?.id ?? null,
  }
}

export type MarkNotificationsReadParams = {
  ids?: readonly string[]
  all?: boolean
  /** Injectable timestamp; defaults to now. */
  readAt?: string
  /** Injectable clock for unread count window; defaults to now. */
  nowMs?: number
}

export type MarkNotificationsReadResult = {
  items: Notification[]
  unreadCount: number
}

export const markNotificationsAsRead = ({
  ids,
  all = false,
  readAt = new Date().toISOString(),
  nowMs = Date.now(),
}: MarkNotificationsReadParams): MarkNotificationsReadResult => {
  const state = getState()

  state.notifications = markNotificationsRead(
    state.notifications,
    readAt,
    all ? undefined : (ids ?? [])
  )
  const visibleNotifications = selectLastMonthNotifications(state.notifications, new Date(nowMs))

  return {
    items: state.notifications.map((notification) => ({ ...notification })),
    unreadCount: countUnreadNotifications(visibleNotifications),
  }
}

export const prependNotification = (event: NotificationEvent): Notification => {
  const notification = mapNotificationEvent(event)
  const state = getState()

  state.notifications = [
    notification,
    ...state.notifications.filter(({ id }) => id !== notification.id),
  ]

  return { ...notification }
}

export type ScheduleSubscriptionActivatedNotificationParams = {
  subscriptionId: string
  expiresAt: string
  delayMs?: number
  nowMs?: number
}

export const scheduleSubscriptionActivatedNotification = ({
  subscriptionId,
  expiresAt,
  delayMs = SUBSCRIPTION_ACTIVATION_NOTIFICATION_DELAY_MS,
  nowMs = Date.now(),
}: ScheduleSubscriptionActivatedNotificationParams): string => {
  const state = getState()
  const id = `mock-notification-activation-${subscriptionId}`

  if (
    state.scheduledNotificationTimers.has(id) ||
    state.notifications.some((notification) => notification.id === id)
  ) {
    return id
  }

  const timeoutId = globalThis.setTimeout(() => {
    state.scheduledNotificationTimers.delete(id)
    prependNotification({
      id,
      kind: 'subscriptionActivated',
      createdAt: new Date(nowMs + delayMs).toISOString(),
      payload: { expiresAt },
    })
  }, delayMs)

  if (typeof timeoutId === 'object' && 'unref' in timeoutId) {
    timeoutId.unref()
  }

  state.scheduledNotificationTimers.set(id, timeoutId)

  return id
}

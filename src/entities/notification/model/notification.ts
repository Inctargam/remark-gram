/**
 * Notification shapes are maintained by hand until the backend exposes notifications in
 * the OpenAPI schema. Mock adapters should map to these types; widgets must not consume
 * transport DTOs directly.
 */
export type NotificationKind = 'subscriptionActivated' | 'nextPayment' | 'subscriptionExpires'

export type NotificationPayload = {
  /** ISO 8601 */
  expiresAt?: string
  daysLeft?: 1 | 7
}

export type Notification = {
  id: string
  kind: NotificationKind
  message: string
  /** ISO 8601 */
  createdAt: string
  /** ISO 8601 when the user has read it, otherwise `null`. */
  readAt: string | null
  payload: NotificationPayload
}

export type NotificationEvent = {
  id: string
  kind: NotificationKind
  /** Optional while the mock owns message formatting. Real backend may send ready text. */
  message?: string
  /** ISO 8601 */
  createdAt: string
  readAt?: string | null
  payload?: NotificationPayload
}

export type NotificationPage = {
  items: Notification[]
  /** Id of the first notification of the next page, `null` on the last page. */
  nextCursor: string | null
}

const MS_IN_DAY = 24 * 60 * 60 * 1000
const LAST_MONTH_DAYS = 31
export const SUBSCRIPTION_ACTIVATION_NOTIFICATION_DELAY_MS = 30_000

const formatSubscriptionDate = (isoDate: string): string => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return 'xx.yy.zzzz'
  }

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()

  return `${day}.${month}.${year}`
}

export const buildNotificationMessage = (
  kind: NotificationKind,
  payload: NotificationPayload = {}
): string => {
  if (kind === 'subscriptionActivated') {
    return `Ваша подписка активирована и действует до ${formatSubscriptionDate(
      payload.expiresAt ?? ''
    )}`
  }

  if (kind === 'nextPayment') {
    return 'Следующий платеж у вас спишется через 1 день'
  }

  const daysLeft = payload.daysLeft ?? 1
  const dayLabel = daysLeft === 1 ? 'день' : 'дней'

  return `Ваша подписка истекает через ${daysLeft} ${dayLabel}`
}

export const mapNotificationEvent = (event: NotificationEvent): Notification => ({
  id: event.id,
  kind: event.kind,
  message: event.message ?? buildNotificationMessage(event.kind, event.payload),
  createdAt: event.createdAt,
  readAt: event.readAt ?? null,
  payload: event.payload ?? {},
})

export const countUnreadNotifications = (notifications: readonly Notification[]): number =>
  notifications.filter(({ readAt }) => readAt === null).length

export const markNotificationsRead = (
  notifications: readonly Notification[],
  readAt: string,
  ids?: readonly string[]
): Notification[] => {
  const idsToMark = ids ? new Set(ids) : null

  return notifications.map((notification) => {
    const shouldMark = idsToMark === null || idsToMark.has(notification.id)

    if (!shouldMark || notification.readAt !== null) {
      return notification
    }

    return { ...notification, readAt }
  })
}

export const isNotificationInLastMonth = (notification: Notification, now: Date): boolean => {
  const createdAt = new Date(notification.createdAt).getTime()

  if (Number.isNaN(createdAt)) {
    return false
  }

  const ageMs = now.getTime() - createdAt

  return ageMs >= 0 && ageMs <= LAST_MONTH_DAYS * MS_IN_DAY
}

export const selectLastMonthNotifications = (
  notifications: readonly Notification[],
  now: Date
): Notification[] =>
  notifications.filter((notification) => isNotificationInLastMonth(notification, now))

import type { Notification, NotificationPage } from '@/entities/notification'
import { countUnreadNotifications } from '@/entities/notification'

const isNotification = (value: Notification | undefined): value is Notification =>
  value !== undefined

export const flattenNotificationPages = (
  pages: readonly (NotificationPage | undefined)[] | undefined
): Notification[] => pages?.flatMap((page) => page?.items?.filter(isNotification) ?? []) ?? []

export const getNotificationsBadgeCount = (
  pages: readonly (NotificationPage | undefined)[] | undefined
): number => countUnreadNotifications(flattenNotificationPages(pages))

export const formatNotificationTime = (isoDate: string): string => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')

  return `${day}.${month}, ${hours}:${minutes}`
}

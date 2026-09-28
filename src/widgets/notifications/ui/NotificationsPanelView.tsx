import type { Notification } from '@/entities/notification'
import { Button } from '@/shared/ui/button'
import { Scroll } from '@/shared/ui/scroll'

import { formatNotificationTime } from '../lib/notificationsView'
import styles from './notificationsMenu.module.css'

type Props = {
  error?: string | null
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  isLoading?: boolean
  notifications: readonly Notification[]
  onLoadMore?: () => void
}

const SKELETON_ROWS = 4

export const NotificationsPanelView = ({
  error = null,
  hasNextPage = false,
  isFetchingNextPage = false,
  isLoading = false,
  notifications,
  onLoadMore,
}: Props) => {
  const hasNotifications = notifications.length > 0

  return (
    <section className={styles.panel} aria-labelledby="notifications-title">
      <div className={styles.header}>
        <h2 className={styles.title} id="notifications-title">
          Notifications
        </h2>
        <span className={styles.caption}>Last month</span>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {isLoading && !hasNotifications ? (
        <div className={styles.skeletonList} aria-label="Loading notifications">
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <div className={styles.skeletonItem} key={index} />
          ))}
        </div>
      ) : (
        <Scroll className={styles.scroll}>
          {hasNotifications ? (
            <ul className={styles.list}>
              {notifications.map((notification) => {
                const isUnread = notification.readAt === null
                const time = formatNotificationTime(notification.createdAt)

                return (
                  <li
                    className={styles.item}
                    data-unread={isUnread || undefined}
                    key={notification.id}>
                    <span className={styles.marker} aria-hidden="true" />
                    <span className={styles.message}>{notification.message}</span>
                    {time && (
                      <time className={styles.time} dateTime={notification.createdAt}>
                        {time}
                      </time>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className={styles.empty}>No notifications yet</p>
          )}
        </Scroll>
      )}

      {hasNextPage && (
        <Button
          className={styles.loadMore}
          disabled={isFetchingNextPage}
          variant="text"
          onClick={onLoadMore}>
          {isFetchingNextPage ? 'Loading...' : 'Show more'}
        </Button>
      )}
    </section>
  )
}

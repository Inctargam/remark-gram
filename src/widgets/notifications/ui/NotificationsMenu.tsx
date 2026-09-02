'use client'

import { Popover } from '@base-ui/react/popover'

import { Icon } from '@/shared/ui/icon'

import { useNotificationsMenu } from '../model/useNotificationsMenu'
import styles from './notificationsMenu.module.css'
import { NotificationsPanelView } from './NotificationsPanelView'

type Props = {
  compact?: boolean
}

export const NotificationsMenu = ({ compact = false }: Props) => {
  const {
    badgeLabel,
    hasUnreadNotifications,
    isOpen,
    loadMoreHandler,
    notifications,
    notificationsQuery,
    openChangeHandler,
  } = useNotificationsMenu()

  return (
    <Popover.Root open={isOpen} onOpenChange={openChangeHandler}>
      <Popover.Trigger
        className={styles.trigger}
        aria-label={
          hasUnreadNotifications ? `Notifications, ${badgeLabel} unread` : 'Notifications'
        }>
        <Icon iconId="icon-bell-outline" />
        {hasUnreadNotifications && <span className={styles.badge}>{badgeLabel}</span>}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={compact ? 10 : 12} align="end">
          <Popover.Popup className={styles.popup}>
            <NotificationsPanelView
              error={notificationsQuery.isError ? 'Failed to load notifications' : null}
              hasNextPage={notificationsQuery.hasNextPage}
              isFetchingNextPage={notificationsQuery.isFetchingNextPage}
              isLoading={notificationsQuery.isLoading}
              notifications={notifications}
              onLoadMore={loadMoreHandler}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

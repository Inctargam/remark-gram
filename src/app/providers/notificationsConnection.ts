import type { QueryClient } from '@tanstack/react-query'

import type {
  MockNotificationsRealtimeParams,
  NotificationsInfiniteData,
} from '@/entities/notification'
import {
  connectMockNotificationsRealtime,
  notificationQueryKeys,
  prependNotificationEventToCache,
} from '@/entities/notification'
import type { SessionStatus } from '@/shared/auth'

type ConnectNotificationsRealtime = (params: MockNotificationsRealtimeParams) => () => void

export type StartNotificationsConnectionParams = {
  accessToken: string | null
  connect?: ConnectNotificationsRealtime
  isMockApi?: boolean
  queryClient: QueryClient
  status: SessionStatus
}

export const startNotificationsConnection = ({
  accessToken,
  connect = connectMockNotificationsRealtime,
  isMockApi = process.env.NEXT_PUBLIC_NOTIFICATIONS_API_MOCK !== 'false',
  queryClient,
  status,
}: StartNotificationsConnectionParams): (() => void) | undefined => {
  if (status !== 'authenticated' || !accessToken || !isMockApi) {
    return undefined
  }

  return connect({
    onEvent: (event) => {
      queryClient.setQueriesData<NotificationsInfiniteData>(
        { queryKey: notificationQueryKeys.lists() },
        (data) => prependNotificationEventToCache(data, event)
      )
    },
  })
}

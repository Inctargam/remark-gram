import { api } from '@/shared/api/baseApi'

import type { NotificationPage } from '../model/notification'

const MOCK_NOTIFICATIONS_PATH = '/api/mock/notifications'
const REAL_NOTIFICATIONS_PATH = '/api/v1/notifications'

export const NOTIFICATIONS_PAGE_SIZE = 20

/**
 * Mock is the default until the backend exposes notifications/WebSocket endpoints.
 * Set `NEXT_PUBLIC_NOTIFICATIONS_API_MOCK=false` when the real contract is available.
 */
const isMockNotificationsApi = () => process.env.NEXT_PUBLIC_NOTIFICATIONS_API_MOCK !== 'false'

const getBasePath = () =>
  isMockNotificationsApi() ? MOCK_NOTIFICATIONS_PATH : REAL_NOTIFICATIONS_PATH

/** Empty base url keeps mock calls on the current origin; real ones fall back to the API base. */
const getRequestInit = () => (isMockNotificationsApi() ? { baseUrl: '' } : undefined)

export type GetNotificationsParams = {
  cursor?: string | null
  limit?: number
}

export const getNotifications = async ({
  cursor = null,
  limit = NOTIFICATIONS_PAGE_SIZE,
}: GetNotificationsParams = {}): Promise<NotificationPage> => {
  const searchParams = new URLSearchParams({ limit: String(limit) })

  if (cursor) {
    searchParams.set('cursor', cursor)
  }

  const response = await api.get(`${getBasePath()}?${searchParams.toString()}`, getRequestInit())

  return response.json()
}

export type MarkNotificationsReadPayload = {
  ids?: string[]
  all?: boolean
}

export type MarkNotificationsReadResponse = {
  unreadCount: number
}

export const markNotificationsReadRequest = async (
  payload: MarkNotificationsReadPayload
): Promise<MarkNotificationsReadResponse> => {
  const response = await api.post(`${getBasePath()}/read`, payload, getRequestInit())

  return response.json()
}

'use client'

import type { NotificationEvent } from '../model/notification'

export type MockNotificationsRealtimeParams = {
  intervalMs?: number
  now?: () => Date
  onEvent: (event: NotificationEvent) => void
}

const DEFAULT_INTERVAL_MS = 30_000

const createMockNotificationEvent = (createdAt: Date): NotificationEvent => ({
  id: `mock-notification-live-${createdAt.getTime()}`,
  kind: 'nextPayment',
  createdAt: createdAt.toISOString(),
})

/**
 * Browser-side realtime stand-in. Next.js route handlers are not a WebSocket server, so the
 * mock emits events locally while the real adapter will replace this file's call site later.
 */
export const connectMockNotificationsRealtime = ({
  intervalMs = DEFAULT_INTERVAL_MS,
  now = () => new Date(),
  onEvent,
}: MockNotificationsRealtimeParams): (() => void) => {
  const intervalId = window.setInterval(() => {
    onEvent(createMockNotificationEvent(now()))
  }, intervalMs)

  return () => {
    window.clearInterval(intervalId)
  }
}

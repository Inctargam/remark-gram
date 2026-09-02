'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { sessionStore, useSessionStatus } from '@/shared/auth'

import { startNotificationsConnection } from './notificationsConnection'

/**
 * App-level synchronization: starts one notification stream for an authenticated session and
 * mirrors realtime events into TanStack Query cache. It renders nothing by design.
 */
export const NotificationsController = () => {
  const queryClient = useQueryClient()
  const status = useSessionStatus()

  useEffect(() => {
    const { accessToken } = sessionStore.getState()

    return startNotificationsConnection({
      accessToken,
      queryClient,
      status,
    })
  }, [queryClient, status])

  return null
}

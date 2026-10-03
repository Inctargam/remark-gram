'use client'

import { useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { checkMockAuth, refreshSession, sessionStore } from '@/shared/auth'
import { IS_MOCK_AUTH } from '@/shared/config'

import { shouldClearQueryClientOnSessionChange } from './sessionQueryCleanup'

type Props = {
  children: ReactNode
}

export const SessionBootstrap = ({ children }: Props) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = sessionStore.subscribe((state, previousState) => {
      if (shouldClearQueryClientOnSessionChange(state.status, previousState.status)) {
        queryClient.clear()
        // TODO(auth-redirect): Redirect only from protected routes when route guards are introduced.
      }
    })

    if (IS_MOCK_AUTH) {
      void checkMockAuth()
    } else {
      void refreshSession()
    }

    return unsubscribe
  }, [queryClient])

  return children
}

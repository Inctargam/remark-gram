'use client'

import { useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { refreshAccessToken } from '@/shared/api/openapi'
import { sessionStore } from '@/shared/auth'

type Props = {
  children: ReactNode
}

export const SessionBootstrap = ({ children }: Props) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = sessionStore.subscribe((state, previousState) => {
      if (state.status === 'guest' && previousState.status !== 'guest') {
        queryClient.clear()
        // TODO(auth-redirect): Redirect only from protected routes when route guards are introduced.
      }
    })

    void refreshAccessToken()

    return unsubscribe
  }, [queryClient])

  return children
}

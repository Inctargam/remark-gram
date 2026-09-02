'use client'

import type { ReactNode } from 'react'

import { NotificationsController } from './NotificationsController'
import { QueryProvider } from './QueryProvider'
import { SessionBootstrap } from './SessionBootstrap'

type Props = {
  children: ReactNode
}

export const AppProviders = ({ children }: Props) => (
  <QueryProvider>
    <SessionBootstrap>
      <NotificationsController />
      {children}
    </SessionBootstrap>
  </QueryProvider>
)

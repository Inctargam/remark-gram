'use client'

import type { ReactNode } from 'react'

import { QueryProvider } from './QueryProvider'
import { SessionBootstrap } from './SessionBootstrap'

type Props = {
  children: ReactNode
}

export const AppProviders = ({ children }: Props) => (
  <QueryProvider>
    <SessionBootstrap>{children}</SessionBootstrap>
  </QueryProvider>
)

'use client'

import type { ReactNode } from 'react'

import { useLogoutMutation } from '@/features/logout'
import { useSessionStatus } from '@/shared/auth'

import { AppShellView } from './AppShellView'

type Props = {
  children: ReactNode
}

export const AppShell = ({ children }: Props) => {
  const status = useSessionStatus()
  const { mutateAsync: logout } = useLogoutMutation()

  return (
    <AppShellView status={status} onLogout={logout}>
      {children}
    </AppShellView>
  )
}

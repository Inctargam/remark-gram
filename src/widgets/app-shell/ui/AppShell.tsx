'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { useLogoutMutation } from '@/features/logout'
import { useSessionStatus } from '@/shared/auth'
import { ROUTES } from '@/shared/config'

import { AppShellView } from './AppShellView'

type Props = {
  children: ReactNode
}

export const AppShell = ({ children }: Props) => {
  const pathname = usePathname()
  const status = useSessionStatus()
  const { mutateAsync: logout } = useLogoutMutation()
  const isSettingsPage = pathname === ROUTES.settings

  return (
    <AppShellView hideBottomBar={isSettingsPage} status={status} onLogout={logout}>
      {children}
    </AppShellView>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { useLogoutMutation } from '@/features/logout'
import { useSessionStatus } from '@/shared/auth'

import { ROUTES_WITHOUT_BOTTOM_BAR } from '../config/appShellRoutes'
import { AppShellView } from './AppShellView'

type Props = {
  children: ReactNode
}

export const AppShell = ({ children }: Props) => {
  const pathname = usePathname()
  const status = useSessionStatus()
  const { mutateAsync: logout } = useLogoutMutation()
  const hideBottomBar = ROUTES_WITHOUT_BOTTOM_BAR.some((route) => pathname === route)

  return (
    <AppShellView hideBottomBar={hideBottomBar} status={status} onLogout={logout}>
      {children}
    </AppShellView>
  )
}

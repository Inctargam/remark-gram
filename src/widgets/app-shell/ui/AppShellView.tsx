'use client'

import type { ReactNode } from 'react'

import { LogoutButton } from '@/features/logout'
import type { SessionStatus } from '@/shared/auth'
import type { SelectOption } from '@/shared/ui/select'
import { Select } from '@/shared/ui/select'
import { Header } from '@/widgets/header'
import { BottomBar, Sidebar } from '@/widgets/navigation'

import styles from './AppShell.module.css'

type Props = {
  children: ReactNode
  status: SessionStatus
  onLogout: () => Promise<void>
}

const LANGUAGE_OPTIONS: SelectOption<string>[] = [
  { label: 'English', value: 'en' },
  { label: 'Russian', value: 'ru' },
]

export const AppShellView = ({ children, status, onLogout }: Props) => {
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  return (
    <div className={styles.shell}>
      {!isLoading && (
        <Header
          languageSelector={
            <Select className={styles.languageSelector} options={LANGUAGE_OPTIONS} value="en" />
          }
          variant={isAuthenticated ? 'auth' : 'guest'}
        />
      )}
      <div className={styles.content}>
        {isAuthenticated && (
          <div className={styles.sidebarSlot}>
            <Sidebar footer={<LogoutButton onLogout={onLogout} />} />
          </div>
        )}
        <div className={styles.main}>{children}</div>
        {isAuthenticated && (
          <div className={styles.bottomBarSlot}>
            <BottomBar />
          </div>
        )}
      </div>
    </div>
  )
}

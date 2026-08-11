import clsx from 'clsx'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { LogoutButton } from '@/features/logout'
import type { SessionStatus } from '@/shared/auth'
import { Icon } from '@/shared/ui/icon'
import type { SelectOption } from '@/shared/ui/select'
import { Select } from '@/shared/ui/select'
import { Header, HeaderMobile } from '@/widgets/header'
import { BottomBar, Sidebar } from '@/widgets/navigation'

import styles from './AppShell.module.css'

type Props = {
  children: ReactNode
  hideBottomBar?: boolean
  status: SessionStatus
  onLogout: () => Promise<void>
}

const LANGUAGE_OPTIONS: SelectOption<string>[] = [
  { label: 'English', value: 'en' },
  { label: 'Russian', value: 'ru' },
]

export const AppShellView = ({ children, hideBottomBar = false, status, onLogout }: Props) => {
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const showBottomBar = isAuthenticated && !hideBottomBar

  return (
    <div className={styles.shell}>
      {!isLoading && (
        <>
          <div className={clsx(styles.desktopHeader, isAuthenticated && styles.authDesktopHeader)}>
            <Header
              languageSelector={
                <Select className={styles.languageSelector} options={LANGUAGE_OPTIONS} value="en" />
              }
              variant={isAuthenticated ? 'auth' : 'guest'}
            />
          </div>
          {isAuthenticated && (
            <div className={styles.mobileHeader}>
              <HeaderMobile
                languageSelector={
                  <span aria-label="Russian" className={styles.mobileLanguage}>
                    <Image alt="" height={24} src="/icons/flag-ru.svg" width={24} />
                    <Icon iconId="icon-arrow-ios-down-outline" width={16} height={16} />
                  </span>
                }
              />
            </div>
          )}
        </>
      )}
      <div className={styles.content}>
        {isAuthenticated && (
          <div className={styles.sidebarSlot}>
            <Sidebar footer={<LogoutButton onLogout={onLogout} />} />
          </div>
        )}
        <div className={styles.main}>{children}</div>
        {showBottomBar && (
          <div className={styles.bottomBarSlot}>
            <BottomBar />
          </div>
        )}
      </div>
    </div>
  )
}

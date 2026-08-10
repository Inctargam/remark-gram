'use client'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { LogoutButton } from '@/features/logout'
import type { SessionStatus } from '@/shared/auth'
import {
  Header,
  type HeaderLanguage,
  HeaderLanguageSwitcher,
  HeaderMobile,
  HeaderMobileMenu,
} from '@/widgets/header'
import { BottomBar, Sidebar } from '@/widgets/navigation'

import styles from './AppShell.module.css'

type Props = {
  children: ReactNode
  hideBottomBar?: boolean
  showGuestAuthActions?: boolean
  status: SessionStatus
  onLogout: () => Promise<void>
}

export const AppShellView = ({
  children,
  hideBottomBar = false,
  showGuestAuthActions = true,
  status,
  onLogout,
}: Props) => {
  const [language, setLanguage] = useState<HeaderLanguage>('en')
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const showBottomBar = isAuthenticated && !hideBottomBar

  return (
    <div className={styles.shell}>
      {!isLoading && (
        <>
          <div className={styles.desktopHeader}>
            {isAuthenticated ? (
              <Header
                languageSelector={
                  <HeaderLanguageSwitcher value={language} onValueChange={setLanguage} />
                }
                variant="auth"
              />
            ) : (
              <Header
                languageSelector={
                  <HeaderLanguageSwitcher value={language} onValueChange={setLanguage} />
                }
                showAuthActions={showGuestAuthActions}
                variant="guest"
              />
            )}
          </div>
          <div className={styles.mobileHeader}>
            {isAuthenticated ? (
              <HeaderMobile
                languageSelector={
                  <HeaderLanguageSwitcher compact value={language} onValueChange={setLanguage} />
                }
                menu={<HeaderMobileMenu onLogout={onLogout} />}
                variant="auth"
              />
            ) : (
              <HeaderMobile
                languageSelector={
                  <HeaderLanguageSwitcher compact value={language} onValueChange={setLanguage} />
                }
                showAuthActions={showGuestAuthActions}
                variant="guest"
              />
            )}
          </div>
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

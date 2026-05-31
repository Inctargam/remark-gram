import type { ReactNode } from 'react'

import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'

import styles from './header.module.css'

type Variant = 'auth' | 'guest'

export type HeaderProps = {
  variant: Variant
  // Slot pattern: the page/feature layer injects the language selector component.
  // Keeps Header decoupled from the Select implementation (not yet built).
  languageSelector?: ReactNode
  notificationCount?: number
  onLoginClick?: () => void
  onSignupClick?: () => void
}

export const Header = ({
  variant,
  languageSelector,
  notificationCount = 0,
  onLoginClick,
  onSignupClick,
}: HeaderProps) => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <span className={styles.logo}>remarkgram</span>
      <div className={styles.controls}>
        {variant === 'auth' && (
          <div className={styles.bell}>
            <Icon iconId="icon-bell-outline" />
            {notificationCount > 0 && <span className={styles.badge}>{notificationCount}</span>}
          </div>
        )}
        {languageSelector}
        {variant === 'guest' && (
          <>
            <Button variant="text" onClick={onLoginClick}>
              Log in
            </Button>
            <Button variant="primary" onClick={onSignupClick}>
              Sign up
            </Button>
          </>
        )}
      </div>
    </div>
  </header>
)

'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'

import styles from './header.module.css'

// Discriminated union — TS не позволит передать notificationCount при variant="guest"
// и onLoginClick при variant="auth": невозможные комбинации отсечены на уровне типов.
type AuthVariant = {
  variant: 'auth'
  notificationCount?: number
  onBellClick?: () => void
  languageSelector?: ReactNode
}

type GuestVariant = {
  variant: 'guest'
  // Принимаем строки чтобы не хардкодить 'Log in' / 'Sign up' — заготовка под i18n.
  loginLabel?: string
  signupLabel?: string
  onLoginClick?: () => void
  onSignupClick?: () => void
  languageSelector?: ReactNode
}

export type HeaderProps = AuthVariant | GuestVariant

export const Header = (props: HeaderProps) => {
  const { variant, languageSelector } = props

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} href={ROUTES.home}>
          remarkgram
        </Link>

        <div className={styles.controls}>
          {variant === 'auth' && (
            <button
              aria-label="Notifications"
              className={styles.bell}
              type="button"
              onClick={props.onBellClick}>
              <Icon iconId="icon-bell-outline" />
              {!!props.notificationCount && props.notificationCount > 0 && (
                <span className={styles.badge}>
                  {props.notificationCount > 99 ? '99+' : props.notificationCount}
                </span>
              )}
            </button>
          )}

          {languageSelector}

          {variant === 'guest' && (
            <>
              <Button variant="text" onClick={props.onLoginClick}>
                {props.loginLabel ?? 'Log in'}
              </Button>
              <Button variant="primary" onClick={props.onSignupClick}>
                {props.signupLabel ?? 'Sign up'}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

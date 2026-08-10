'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'

import styles from './header.module.css'

type AuthVariant = {
  variant: 'auth'
  languageSelector?: ReactNode
}

type GuestVariant = {
  variant: 'guest'
  loginLabel?: string
  signupLabel?: string
  languageSelector?: ReactNode
  showAuthActions?: boolean
}

export type HeaderProps = AuthVariant | GuestVariant

export const Header = (props: HeaderProps) => {
  const { variant, languageSelector } = props

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} href={ROUTES.home}>
          Remarkgram
        </Link>

        <div className={styles.controls}>
          {variant === 'auth' && (
            <span aria-hidden="true" className={styles.bell}>
              <Icon iconId="icon-bell-outline" />
            </span>
          )}

          {languageSelector}

          {variant === 'guest' && (props.showAuthActions ?? true) && (
            <>
              <Button nativeButton={false} render={<Link href={ROUTES.signIn} />} variant="text">
                {props.loginLabel ?? 'Log in'}
              </Button>
              <Button nativeButton={false} render={<Link href={ROUTES.signUp} />} variant="primary">
                {props.signupLabel ?? 'Sign up'}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

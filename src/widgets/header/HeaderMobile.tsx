'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'

import styles from './headerMobile.module.css'

type AuthVariant = {
  variant: 'auth'
  languageSelector?: ReactNode
  menu?: ReactNode
}

type GuestVariant = {
  variant: 'guest'
  languageSelector?: ReactNode
  showAuthActions?: boolean
}

export type HeaderMobileProps = AuthVariant | GuestVariant

export const HeaderMobile = (props: HeaderMobileProps) => {
  const { languageSelector, variant } = props

  return (
    <header className={styles.header}>
      <Link className={styles.logo} href={ROUTES.home}>
        Remarkgram
      </Link>

      <div className={styles.controls}>
        {languageSelector}

        {variant === 'guest' && (props.showAuthActions ?? true) && (
          <div className={styles.authActions}>
            <Button
              className={styles.authAction}
              nativeButton={false}
              render={<Link href={ROUTES.signIn} />}
              variant="text">
              Log in
            </Button>
            <Button
              className={styles.authAction}
              nativeButton={false}
              render={<Link href={ROUTES.signUp} />}
              variant="primary">
              Sign up
            </Button>
          </div>
        )}

        {variant === 'auth' && props.menu}
      </div>
    </header>
  )
}

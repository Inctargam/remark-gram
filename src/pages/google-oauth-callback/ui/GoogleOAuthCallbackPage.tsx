'use client'

import Link from 'next/link'

import { useGoogleOAuthCallback } from '@/features/oauth-sign-in'
import { ROUTES } from '@/shared/config'
import { Card } from '@/shared/ui/card'

import styles from './googleOAuthCallbackPage.module.css'

type Props = {
  code: string | null
  state: string | null
  oauthError: string | null
}

export const GoogleOAuthCallbackPage = ({ code, oauthError, state }: Props) => {
  const { error, isPending } = useGoogleOAuthCallback({ code, oauthError, state })

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Card className={styles.card} padding="medium">
          <h1 className={styles.title}>{error ? 'Google sign in failed' : 'Signing in'}</h1>
          {error ? (
            <>
              <p className={styles.message} role="alert">
                {error}
              </p>
              <Link className={styles.link} href={ROUTES.signIn}>
                Back to Sign In
              </Link>
            </>
          ) : (
            <p className={styles.message} aria-live="polite" aria-busy={isPending}>
              Please wait while we finish Google authorization.
            </p>
          )}
        </Card>
      </main>
    </div>
  )
}

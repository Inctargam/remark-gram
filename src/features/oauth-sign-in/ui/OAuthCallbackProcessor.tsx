'use client'

import type { OAuthProvider } from '../model/types'
import { useOAuthCallback } from '../model/useOAuthCallback'
import styles from './oauthCallbackProcessor.module.css'

type Props = {
  code: string | null
  state: string | null
  oauthError: string | null
  provider: OAuthProvider
}

export const OAuthCallbackProcessor = ({ code, oauthError, provider, state }: Props) => {
  useOAuthCallback({ code, oauthError, provider, state })

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.spinner} role="status" aria-label="Signing in" />
      </main>
    </div>
  )
}

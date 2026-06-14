'use client'

import { useGoogleOAuthCallback } from '../model/useGoogleOAuthCallback'
import styles from './googleOAuthCallbackProcessor.module.css'

type Props = {
  code: string | null
  state: string | null
  oauthError: string | null
}

export const GoogleOAuthCallbackProcessor = ({ code, oauthError, state }: Props) => {
  useGoogleOAuthCallback({ code, oauthError, state })

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.spinner} role="status" aria-label="Signing in" />
      </main>
    </div>
  )
}

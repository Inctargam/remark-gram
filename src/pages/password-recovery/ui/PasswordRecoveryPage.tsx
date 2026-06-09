import { PasswordRecoveryExpiredLink } from '@/features/password-recovery'

import styles from './passwordRecoveryPage.module.css'

type Props = {
  email?: string | null
}

export const PasswordRecoveryPage = ({ email }: Props) => (
  <div className={styles.page}>
    <main className={styles.main}>
      <PasswordRecoveryExpiredLink email={email} />
    </main>
  </div>
)

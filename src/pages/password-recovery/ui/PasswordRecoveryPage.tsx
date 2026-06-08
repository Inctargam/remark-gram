import { PasswordRecoveryForm } from '@/features/password-recovery'

import styles from './passwordRecoveryPage.module.css'

export const PasswordRecoveryPage = () => (
  <div className={styles.page}>
    <main className={styles.main}>
      <PasswordRecoveryForm />
    </main>
  </div>
)

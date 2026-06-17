import { ForgotPasswordForm } from '@/features/forgot-password'

import styles from './forgotPasswordPage.module.css'

export const ForgotPasswordPage = () => (
  <div className={styles.page}>
    <main className={styles.main}>
      <ForgotPasswordForm />
    </main>
  </div>
)

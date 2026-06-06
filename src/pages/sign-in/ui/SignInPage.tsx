import { SignInForm } from '@/features/sign-in'

import styles from './signInPage.module.css'

export const SignInPage = () => (
  <div className={styles.page}>
    <main className={styles.main}>
      <SignInForm />
    </main>
  </div>
)

import { SignUpForm } from '@/features/sign-up'

import styles from './signUpPage.module.css'

export const SignUpPage = () => (
  <div className={styles.page}>
    <main className={styles.main}>
      <SignUpForm />
    </main>
  </div>
)

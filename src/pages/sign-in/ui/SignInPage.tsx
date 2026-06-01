import { SignInForm } from '@/features/sign-in'
import { Header } from '@/widgets/header'

import styles from './signInPage.module.css'

export const SignInPage = () => (
  <div className={styles.page}>
    <Header variant="guest" />
    <main className={styles.main}>
      <SignInForm />
    </main>
  </div>
)

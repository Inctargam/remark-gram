import { SignUpForm } from '@/features/sign-up'
import { Header } from '@/widgets/header'

import styles from './signUpPage.module.css'

export const SignUpPage = () => (
  <div className={styles.page}>
    <Header variant="guest" />
    <main className={styles.main}>
      <SignUpForm />
    </main>
  </div>
)

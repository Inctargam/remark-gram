import { CreateNewPasswordForm } from '@/features/create-new-password'

import styles from './createNewPasswordPage.module.css'

export const CreateNewPasswordPage = () => (
  <div className={styles.page}>
    <main className={styles.main}>
      <CreateNewPasswordForm />
    </main>
  </div>
)

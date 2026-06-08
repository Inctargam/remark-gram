'use client'

import Image from 'next/image'

import { Button } from '@/shared/ui/button'

import timeManagementRafiki from '../assets/timeManagementRafiki.png'
import styles from './PasswordRecoveryForm.module.css'

export const PasswordRecoveryForm = () => {
  return (
    <section className={styles.root} aria-labelledby="password-recovery-title">
      <h1 className={styles.title} id="password-recovery-title">
        Email verification link expired
      </h1>
      <p className={styles.description}>
        Looks like the verification link has expired. Not to worry, we can send the link again
      </p>
      <Button className={styles.resendButton} type="button">
        Resend link
      </Button>
      <Image alt="" className={styles.illustration} priority src={timeManagementRafiki} />
    </section>
  )
}

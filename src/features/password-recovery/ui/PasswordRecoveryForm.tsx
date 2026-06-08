'use client'

import Image from 'next/image'
import { useState } from 'react'

import { EmailSentModal } from '@/entities/auth'
import { Button } from '@/shared/ui/button'

import timeManagementRafiki from '../assets/timeManagementRafiki.png'
import styles from './PasswordRecoveryForm.module.css'

type Props = {
  email?: string | null
}

const DEFAULT_RECOVERY_EMAIL = 'epam@epam.com'

export const PasswordRecoveryForm = ({ email = DEFAULT_RECOVERY_EMAIL }: Props) => {
  const [isEmailSentModalOpen, setIsEmailSentModalOpen] = useState(false)

  const resendLinkClickHandler = () => {
    setIsEmailSentModalOpen(true)
  }

  return (
    <>
      <section className={styles.root} aria-labelledby="password-recovery-title">
        <h1 className={styles.title} id="password-recovery-title">
          Email verification link expired
        </h1>
        <p className={styles.description}>
          Looks like the verification link has expired. Not to worry, we can send the link again
        </p>
        <Button className={styles.resendButton} onClick={resendLinkClickHandler} type="button">
          Resend link
        </Button>
        <Image alt="" className={styles.illustration} priority src={timeManagementRafiki} />
      </section>

      <EmailSentModal
        email={email}
        open={isEmailSentModalOpen}
        onOpenChange={setIsEmailSentModalOpen}
      />
    </>
  )
}

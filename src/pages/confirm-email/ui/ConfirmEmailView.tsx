import Image from 'next/image'
import Link from 'next/link'

import { EmailSentModal } from '@/entities/auth'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

import timeManagementRafiki from '../../../shared/assets/timeManagementRafiki.png'
import emailConfirmationSuccess from '../assets/emailConfirmationSuccess.svg'
import styles from './ConfirmEmailView.module.css'

type Props = {
  status: 'loading' | 'success' | 'expired'
  resendEmail: string
  resendError: string
  isResendPending: boolean
  isResendModalOpen: boolean
  onResendEmailChange: (email: string) => void
  onResend: () => void
  onResendModalOpenChange: (open: boolean) => void
}

export const ConfirmEmailView = ({
  status,
  resendEmail,
  resendError,
  isResendPending,
  isResendModalOpen,
  onResendEmailChange,
  onResend,
  onResendModalOpenChange,
}: Props) => {
  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'success') {
    return (
      <section className={styles.success}>
        <h1 className={styles.successTitle}>Congratulations!</h1>
        <p className={styles.successMessage}>Your email has been confirmed</p>
        <Button
          className={styles.signInButton}
          nativeButton={false}
          render={<Link href={ROUTES.signIn} />}
          variant="primary">
          Sign In
        </Button>
        <Image
          className={styles.successIllustration}
          src={emailConfirmationSuccess}
          alt="Email confirmation successful"
          priority
        />
      </section>
    )
  }

  return (
    <section className={styles.expired}>
      <h1 className={styles.expiredTitle}>Email verification link expired</h1>
      <p className={styles.expiredMessage}>
        Looks like the verification link has expired. Not to worry, we can send the link again
      </p>
      <Input
        className={styles.resendInput}
        label="Email"
        placeholder="Epam@epam.com"
        type="email"
        value={resendEmail}
        onChange={(e) => onResendEmailChange(e.target.value)}
        error={resendError}
      />
      <Button
        className={styles.resendButton}
        variant="primary"
        type="button"
        disabled={isResendPending}
        onClick={onResend}>
        Resend verification link
      </Button>
      <Image
        className={styles.expiredIllustration}
        src={timeManagementRafiki}
        alt="Email verification link expired"
        priority
      />
      <EmailSentModal
        email={resendEmail}
        open={isResendModalOpen}
        onOpenChange={onResendModalOpenChange}
      />
    </section>
  )
}

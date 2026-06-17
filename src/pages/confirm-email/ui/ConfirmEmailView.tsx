import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

import styles from './ConfirmEmailView.module.css'

type Props = {
  status: 'loading' | 'success' | 'expired'
  resendEmail: string
  resendError: string
  isResendPending: boolean
  isResendSuccess: boolean
  onResendEmailChange: (email: string) => void
  onResend: () => void
}

export const ConfirmEmailView = ({
  status,
  resendEmail,
  resendError,
  isResendPending,
  isResendSuccess,
  onResendEmailChange,
  onResend,
}: Props) => {
  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'success') {
    return (
      <div>
        <h1>Congratulations!</h1>
        <p>Your email has been confirmed</p>
        <Link className={styles.signInLink} href={ROUTES.signIn}>
          Sign In
        </Link>
      </div>
    )
  }

  // status === 'expired'
  if (isResendSuccess) {
    return <p>A new verification link has been sent. Please check your email.</p>
  }

  return (
    <div>
      <h1>Looks like the verification link has expired...</h1>
      <p>Please enter your email to receive a new verification link.</p>
      <Input
        label="Email"
        type="email"
        value={resendEmail}
        onChange={(e) => onResendEmailChange(e.target.value)}
        error={resendError}
      />
      <Button variant="primary" type="button" disabled={isResendPending} onClick={onResend}>
        Resend verification link
      </Button>
    </div>
  )
}

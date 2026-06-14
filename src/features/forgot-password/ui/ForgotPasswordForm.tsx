'use client'
import Link from 'next/link'

import { EmailSentModal } from '@/entities/auth'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Recaptcha } from '@/shared/ui/recaptcha'

import { useForgotPasswordForm } from '../model/useForgotPasswordForm'
import styles from './ForgotPasswordForm.module.css'

export const ForgotPasswordForm = () => {
  const {
    confirmationOpenChangeHandler,
    emailError,
    emailField,
    isConfirmationOpen,
    isSubmitDisabled,
    recaptchaState,
    recaptchaVerifyHandler,
    submitHandler,
    submittedEmail,
  } = useForgotPasswordForm()

  return (
    <Card className={styles.card} padding="medium">
      <form className={styles.form} onSubmit={submitHandler}>
        <h1 className={styles.title}>Forgot Password</h1>

        <Input
          className={styles.emailField}
          error={emailError}
          label="Email"
          placeholder="Epam@epam.com"
          type="email"
          {...emailField}
        />

        <p className={styles.description}>
          Enter your email address and we will send you further instructions
        </p>

        {submittedEmail && (
          <p className={styles.message} role="status">
            The link has been sent by email.
            <br />
            If you don&rsquo;t receive an email send link again
          </p>
        )}

        <Button
          className={styles.submitButton}
          disabled={isSubmitDisabled}
          type="submit"
          variant="primary">
          {submittedEmail ? 'Send Link Again' : 'Send Link'}
        </Button>

        <Link className={styles.signInLink} href={ROUTES.signIn}>
          Back to Sign In
        </Link>

        {!submittedEmail && (
          <Recaptcha
            className={styles.recaptcha}
            onVerifyRequest={recaptchaVerifyHandler}
            state={recaptchaState}
          />
        )}
      </form>

      <EmailSentModal
        email={submittedEmail}
        open={isConfirmationOpen}
        onOpenChange={confirmationOpenChangeHandler}
      />
    </Card>
  )
}

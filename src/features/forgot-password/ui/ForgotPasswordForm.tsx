'use client'
import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Recaptcha } from '@/shared/ui/recaptcha'

import styles from './ForgotPasswordForm.module.css'

export const ForgotPasswordForm = () => (
  <Card className={styles.card} padding="medium">
    <form className={styles.form}>
      <h1 className={styles.title}>Forgot Password</h1>

      <Input
        className={styles.emailField}
        label="Email"
        name="email"
        placeholder="Epam@epam.com"
        type="email"
      />

      <p className={styles.description}>
        Enter your email address and we will send you further instructions
      </p>

      <Button className={styles.submitButton} type="submit" variant="primary">
        Send Link
      </Button>

      <Link className={styles.signInLink} href={ROUTES.signIn}>
        Back to Sign In
      </Link>

      <Recaptcha className={styles.recaptcha} />
    </form>
  </Card>
)

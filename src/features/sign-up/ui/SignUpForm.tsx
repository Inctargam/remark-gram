'use client'

import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Checkbox } from '@/shared/ui/checkbox'
import { Icon } from '@/shared/ui/icon'
import { Input } from '@/shared/ui/input'

import styles from './SignUpForm.module.css'

export const SignUpForm = () => {
  return (
    <Card className={styles.card} padding="medium">
      <form className={styles.form}>
        <h1 className={styles.title}>Sign Up</h1>

        <div className={styles.socials} aria-label="Social sign up options">
          <button className={styles.socialButton} type="button" aria-label="Sign up with Google">
            <Icon iconId="icon-google" width={36} height={36} />
          </button>
          <button className={styles.socialButton} type="button" aria-label="Sign up with GitHub">
            <Icon iconId="icon-github" width={36} height={36} />
          </button>
        </div>

        <div className={styles.fields}>
          <Input label="Username" name="username" placeholder="Epam11" type="text" />
          <Input label="Email" name="email" placeholder="Epam@epam.com" type="email" />
          <Input
            label="Password"
            name="password"
            placeholder="******************"
            type="password"
          />
          <Input
            label="Password confirmation"
            name="passwordConfirmation"
            placeholder="******************"
            type="password"
          />
        </div>

        <div className={styles.agreement}>
          <Checkbox aria-label="Agree to Terms of Service and Privacy Policy" />
          <p className={styles.agreementLabel}>
            I agree to the{' '}
            <Link className={styles.agreementLink} href={ROUTES.termsOfService}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link className={styles.agreementLink} href={ROUTES.privacyPolicy}>
              Privacy Policy
            </Link>
          </p>
        </div>

        <Button className={styles.submitButton} type="submit" variant="primary">
          Sign Up
        </Button>

        <div className={styles.signinBlock}>
          <p className={styles.signinText}>Do you have an account?</p>
          <Button className={styles.signinButton} type="button" variant="text">
            Sign In
          </Button>
        </div>
      </form>
    </Card>
  )
}

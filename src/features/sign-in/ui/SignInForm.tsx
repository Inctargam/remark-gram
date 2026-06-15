'use client'

import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Icon } from '@/shared/ui/icon'
import { Input } from '@/shared/ui/input'

import { useSignInForm } from '../model/useSignInForm'
import { EMAIL_RULES, PASSWORD_RULES } from '../model/validationRules'
import styles from './SignInForm.module.css'

export const SignInForm = () => {
  const { register, errors, isSubmitDisabled, submitHandler } = useSignInForm()

  return (
    <Card className={styles.card} padding="medium">
      <form className={styles.form} onSubmit={submitHandler}>
        <h1 className={styles.title}>Sign In</h1>

        <div className={styles.socials} aria-label="Social sign in options">
          <button className={styles.socialButton} type="button" aria-label="Sign in with Google">
            <Icon iconId="icon-google" width={36} height={36} />
          </button>
          <button className={styles.socialButton} type="button" aria-label="Sign in with GitHub">
            <Icon iconId="icon-github" width={36} height={36} />
          </button>
        </div>

        <div className={styles.fields}>
          <Input
            label="Email"
            placeholder="Epam@epam.com"
            type="email"
            error={errors.email?.message}
            {...register('email', EMAIL_RULES)}
          />
          <Input
            label="Password"
            placeholder="**********"
            type="password"
            error={errors.password?.message}
            {...register('password', PASSWORD_RULES)}
          />
        </div>

        <Link className={styles.forgotPassword} href={ROUTES.forgotPassword}>
          Forgot Password
        </Link>

        <Button
          className={styles.submitButton}
          type="submit"
          variant="primary"
          disabled={isSubmitDisabled}>
          Sign In
        </Button>

        <div className={styles.signupBlock}>
          <p className={styles.signupText}>Don&rsquo;t have an account?</p>
          <Link className={styles.signupLink} href={ROUTES.signUp}>
            Sign Up
          </Link>
        </div>
      </form>
    </Card>
  )
}

'use client'

import Link from 'next/link'

import { useOAuthSignIn } from '@/features/oauth-sign-in'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Icon } from '@/shared/ui/icon'
import { Input } from '@/shared/ui/input'

import styles from './SignInForm.module.css'

export const SignInForm = () => {
  const { pendingProvider, signInWithOAuth } = useOAuthSignIn()
  const isGooglePending = pendingProvider === 'google'
  const isOAuthPending = pendingProvider !== null

  const googleSignInHandler = () => {
    signInWithOAuth('google')
  }

  const githubSignInHandler = () => {
    signInWithOAuth('github')
  }

  return (
    <Card className={styles.card} padding="medium">
      <form className={styles.form}>
        <h1 className={styles.title}>Sign In</h1>

        <div className={styles.socials} aria-label="Social sign in options">
          <button
            className={styles.socialButton}
            type="button"
            aria-label="Sign in with Google"
            aria-busy={isGooglePending}
            disabled={isOAuthPending}
            onClick={googleSignInHandler}>
            <Icon iconId="icon-google" width={36} height={36} />
          </button>
          <button
            className={styles.socialButton}
            type="button"
            aria-label="Sign in with GitHub"
            disabled={isOAuthPending}
            onClick={githubSignInHandler}>
            <Icon iconId="icon-github" width={36} height={36} />
          </button>
        </div>

        <div className={styles.fields}>
          <Input label="Email" name="email" placeholder="Epam@epam.com" type="email" />
          <Input label="Password" name="password" placeholder="**********" type="password" />
        </div>

        <Link className={styles.forgotPassword} href={ROUTES.forgotPassword}>
          Forgot Password
        </Link>

        <Button className={styles.submitButton} type="submit" variant="primary">
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

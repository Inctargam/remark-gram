'use client'

import Link from 'next/link'
import { Controller } from 'react-hook-form'

import { EMAIL_RULES, PASSWORD_CREATION_RULES } from '@/entities/auth'
import { getOAuthAuthorizeEndpoint } from '@/features/oauth-sign-in'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Checkbox } from '@/shared/ui/checkbox'
import { Icon } from '@/shared/ui/icon'
import { Input } from '@/shared/ui/input'

import { useSignUpForm } from '../model/useSignUpForm'
import { PASSWORD_CONFIRMATION_RULES, USERNAME_RULES } from '../model/validationRules'
import styles from './SignUpForm.module.css'
import { SignUpSuccessModal } from './SignUpSuccessModal'

export const SignUpForm = () => {
  const {
    register,
    control,
    errors,
    isSubmitDisabled,
    submitHandler,
    isSuccessModalOpen,
    registeredEmail,
    closeModalHandler,
  } = useSignUpForm()

  return (
    <Card className={styles.card} padding="medium">
      <form className={styles.form} onSubmit={submitHandler}>
        <h1 className={styles.title}>Sign Up</h1>
        <div className={styles.socials} aria-label="Social sign up options">
          <Button
            className={styles.socialButton}
            nativeButton={false}
            render={<a href={getOAuthAuthorizeEndpoint('google')} />}
            variant="text"
            aria-label="Sign up with Google">
            <Icon iconId="icon-google" width={36} height={36} />
          </Button>
          <Button
            className={styles.socialButton}
            nativeButton={false}
            render={<a href={getOAuthAuthorizeEndpoint('github')} />}
            variant="text"
            aria-label="Sign up with GitHub">
            <Icon iconId="icon-github" width={36} height={36} />
          </Button>
        </div>
        <div className={styles.fields}>
          <Input
            label="Username"
            placeholder="Epam11"
            type="text"
            error={errors.username?.message}
            {...register('username', USERNAME_RULES)}
          />
          <Input
            label="Email"
            placeholder="Epam@epam.com"
            type="email"
            error={errors.email?.message}
            {...register('email', EMAIL_RULES)}
          />
          <Input
            label="Password"
            placeholder="******************"
            type="password"
            error={errors.password?.message}
            {...register('password', PASSWORD_CREATION_RULES)}
          />
          <Input
            label="Password confirmation"
            placeholder="******************"
            type="password"
            error={errors.passwordConfirmation?.message}
            {...register('passwordConfirmation', PASSWORD_CONFIRMATION_RULES)}
          />
        </div>
        <div className={styles.agreement}>
          <Controller
            name="agreeToTerms"
            control={control}
            render={({ field: { ref, value, onChange } }) => (
              <Checkbox
                ref={ref}
                checked={Boolean(value)}
                onCheckedChange={(checked) => onChange(checked)}
                aria-label="Agree to Terms of Service and Privacy Policy"
              />
            )}
          />
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
        <Button
          className={styles.submitButton}
          type="submit"
          variant="primary"
          disabled={isSubmitDisabled}>
          Sign Up
        </Button>
        <div className={styles.signinBlock}>
          <p className={styles.signinText}>Do you have an account?</p>
          <Link className={styles.signinLink} href={ROUTES.signIn}>
            Sign In
          </Link>
        </div>
      </form>
      <SignUpSuccessModal
        open={isSuccessModalOpen}
        email={registeredEmail}
        onClose={closeModalHandler}
      />
    </Card>
  )
}

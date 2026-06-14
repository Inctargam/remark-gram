'use client'

import clsx from 'clsx'
import type { KeyboardEvent } from 'react'

import { Icon } from '../icon'
import styles from './recaptcha.module.css'

export type RecaptchaState = 'default' | 'checked' | 'loading' | 'error' | 'expired'

export type RecaptchaProps = {
  state: RecaptchaState
  label?: string
  errorMessage?: string
  expiredMessage?: string
  className?: string
  onVerifyRequest?: () => void
}

const ERROR_MESSAGES: Partial<Record<RecaptchaState, string>> = {
  error: 'Please verify that you are not a robot',
  expired: 'Verification expired. Check the checkbox again.',
}

export const Recaptcha = ({
  state,
  label = "I'm not a robot",
  errorMessage = ERROR_MESSAGES.error,
  expiredMessage = ERROR_MESSAGES.expired,
  className,
  onVerifyRequest,
}: RecaptchaProps) => {
  const isChecked = state === 'checked'
  const isLoading = state === 'loading'
  const hasOuterError = state === 'error'
  const topMessage = state === 'expired' ? expiredMessage : undefined
  const bottomMessage = state === 'error' ? errorMessage : undefined

  const verifyHandler = () => {
    if (isLoading || isChecked) {
      return
    }

    onVerifyRequest?.()
  }

  const keyDownHandler = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    verifyHandler()
  }

  return (
    <div className={clsx(styles.wrapper, hasOuterError && styles.wrapperError, className)}>
      <div
        aria-checked={isChecked}
        aria-disabled={isLoading ? 'true' : undefined}
        aria-label={label}
        className={clsx(styles.root, styles[state])}
        onClick={verifyHandler}
        onKeyDown={keyDownHandler}
        role="checkbox"
        tabIndex={isLoading ? -1 : 0}>
        {topMessage && <span className={styles.topMessage}>{topMessage}</span>}

        <span className={styles.challenge}>
          <span className={styles.checkbox} aria-hidden="true">
            {isChecked && (
              <Icon
                className={styles.checkmark}
                height={28}
                iconId="icon-checkmark-outline"
                width={28}
              />
            )}
            {isLoading && <span className={styles.spinner} />}
          </span>
          <span className={styles.label}>{label}</span>
        </span>

        <span className={styles.brand}>
          <Icon className={styles.logo} height={30} iconId="icon-recaptcha-logo" width={30} />
          <span className={styles.brandName}>reCAPTCHA</span>
          <span className={styles.links}>Privacy - Terms</span>
        </span>
      </div>

      {bottomMessage && <p className={styles.bottomMessage}>{bottomMessage}</p>}
    </div>
  )
}

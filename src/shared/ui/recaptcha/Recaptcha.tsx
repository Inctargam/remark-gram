'use client'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import { Icon } from '../icon'
import styles from './recaptcha.module.css'

export type RecaptchaState = 'default' | 'hover' | 'checked' | 'loading' | 'error' | 'expired'

export type RecaptchaProps = {
  state?: RecaptchaState
  defaultState?: RecaptchaState
  label?: string
  errorMessage?: string
  expiredMessage?: string
  loadingDuration?: number
  className?: string
  onVerify?: () => void
}

const ERROR_MESSAGES: Partial<Record<RecaptchaState, string>> = {
  error: 'Please verify that you are not a robot',
  expired: 'Verifiction expired. Check the checkbox again.',
}

export const Recaptcha = ({
  state,
  defaultState = 'default',
  label = "I'm not a robot",
  errorMessage = ERROR_MESSAGES.error,
  expiredMessage = ERROR_MESSAGES.expired,
  loadingDuration = 1000,
  className,
  onVerify,
}: RecaptchaProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [internalState, setInternalState] = useState<RecaptchaState>(defaultState)

  const visualState = state ?? internalState
  const isControlled = state !== undefined
  const isChecked = visualState === 'checked'
  const isLoading = visualState === 'loading'
  const hasOuterError = visualState === 'error'
  const topMessage = visualState === 'expired' ? expiredMessage : undefined
  const bottomMessage = visualState === 'error' ? errorMessage : undefined

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const verifyHandler = () => {
    if (isLoading || isChecked) {
      return
    }

    if (!isControlled) {
      setInternalState('loading')

      timeoutRef.current = setTimeout(() => {
        setInternalState('checked')
      }, loadingDuration)
    }

    onVerify?.()
  }

  return (
    <div className={clsx(styles.wrapper, hasOuterError && styles.wrapperError, className)}>
      <button
        aria-checked={isChecked}
        aria-label={label}
        className={clsx(styles.root, styles[visualState])}
        disabled={isLoading}
        onClick={verifyHandler}
        role="checkbox"
        type="button">
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
      </button>

      {bottomMessage && <p className={styles.bottomMessage}>{bottomMessage}</p>}
    </div>
  )
}

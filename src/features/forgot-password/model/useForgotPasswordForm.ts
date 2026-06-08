import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react'

import type { RecaptchaState } from '@/shared/ui/recaptcha'

const RECAPTCHA_LOADING_DURATION = 300

export const useForgotPasswordForm = () => {
  const recaptchaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [email, setEmail] = useState('')
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [recaptchaState, setRecaptchaState] = useState<RecaptchaState>('default')
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const normalizedEmail = email.trim()
  const isRecaptchaVerified = recaptchaState === 'checked'
  const isSubmitDisabled = !normalizedEmail || (!submittedEmail && !isRecaptchaVerified)

  useEffect(() => {
    return () => {
      if (recaptchaTimeoutRef.current) {
        clearTimeout(recaptchaTimeoutRef.current)
      }
    }
  }, [])

  const emailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    setIsConfirmationOpen(false)
    setSubmittedEmail(null)

    if (isRecaptchaVerified) {
      setRecaptchaState('default')
    }
  }

  const recaptchaVerifyHandler = () => {
    setRecaptchaState('loading')

    recaptchaTimeoutRef.current = setTimeout(() => {
      setRecaptchaState('checked')
    }, RECAPTCHA_LOADING_DURATION)
  }

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitDisabled) {
      return
    }

    setSubmittedEmail(normalizedEmail)
    setIsConfirmationOpen(true)
  }

  const confirmationOpenChangeHandler = (open: boolean) => {
    setIsConfirmationOpen(open)
  }

  return {
    confirmationOpenChangeHandler,
    email,
    emailChangeHandler,
    isConfirmationOpen,
    isSubmitDisabled,
    recaptchaState,
    recaptchaVerifyHandler,
    submitHandler,
    submittedEmail,
  }
}

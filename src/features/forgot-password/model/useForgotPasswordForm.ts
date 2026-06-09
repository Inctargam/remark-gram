import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import type { RecaptchaState } from '@/shared/ui/recaptcha'

type ForgotPasswordFormValues = {
  email: string
}

const RECAPTCHA_LOADING_DURATION = 300

export const useForgotPasswordForm = () => {
  const recaptchaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [recaptchaState, setRecaptchaState] = useState<RecaptchaState>('default')
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  })

  const isRecaptchaVerified = recaptchaState === 'checked'
  const isSubmitDisabled = !isValid || (!submittedEmail && !isRecaptchaVerified)

  useEffect(() => {
    return () => {
      if (recaptchaTimeoutRef.current) {
        clearTimeout(recaptchaTimeoutRef.current)
      }
    }
  }, [])

  const emailField = register('email', {
    validate: (value) => Boolean(value.trim()) || 'Email is required',
    onChange: () => {
      setIsConfirmationOpen(false)
      setSubmittedEmail(null)

      if (isRecaptchaVerified) {
        setRecaptchaState('default')
      }
    },
  })

  const recaptchaVerifyHandler = () => {
    setRecaptchaState('loading')

    recaptchaTimeoutRef.current = setTimeout(() => {
      setRecaptchaState('checked')
    }, RECAPTCHA_LOADING_DURATION)
  }

  const submitFormHandler = ({ email }: ForgotPasswordFormValues) => {
    if (isSubmitDisabled) {
      return
    }

    setSubmittedEmail(email.trim())
    setIsConfirmationOpen(true)
  }

  const submitHandler = handleSubmit(submitFormHandler)

  const confirmationOpenChangeHandler = (open: boolean) => {
    setIsConfirmationOpen(open)
  }

  return {
    confirmationOpenChangeHandler,
    emailError: errors.email?.message,
    emailField,
    isConfirmationOpen,
    isSubmitDisabled,
    recaptchaState,
    recaptchaVerifyHandler,
    submitHandler,
    submittedEmail,
  }
}

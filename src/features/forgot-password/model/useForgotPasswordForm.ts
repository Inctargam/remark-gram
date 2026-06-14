import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import type { RecaptchaState } from '@/shared/ui/recaptcha'

type ForgotPasswordFormValues = {
  email: string
}

const RECAPTCHA_LOADING_DURATION = 300

export const useForgotPasswordForm = () => {
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
  const canSubmit = isValid && (Boolean(submittedEmail) || isRecaptchaVerified)
  const isSubmitDisabled = !canSubmit

  useEffect(() => {
    if (recaptchaState !== 'loading') {
      return
    }

    const recaptchaTimeoutId = setTimeout(() => {
      setRecaptchaState('checked')
    }, RECAPTCHA_LOADING_DURATION)

    return () => {
      clearTimeout(recaptchaTimeoutId)
    }
  }, [recaptchaState])

  const emailChangeHandler = () => {
    setIsConfirmationOpen(false)
    setSubmittedEmail(null)

    if (recaptchaState === 'default') {
      return
    }

    setRecaptchaState('default')
  }

  const emailField = register('email', {
    validate: (value) => Boolean(value.trim()) || 'Email is required',
    onChange: emailChangeHandler,
  })

  const recaptchaVerifyHandler = () => {
    setRecaptchaState('loading')
  }

  const submitFormHandler = ({ email }: ForgotPasswordFormValues) => {
    if (!canSubmit) {
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

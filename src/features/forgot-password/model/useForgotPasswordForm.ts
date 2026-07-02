import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useRecaptchaWidget } from '@/shared/lib/recaptcha'

type ForgotPasswordFormValues = {
  email: string
}

export const useForgotPasswordForm = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const {
    containerRef: recaptchaContainerRef,
    token,
    isVerified,
    reset: resetRecaptcha,
  } = useRecaptchaWidget()

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

  const canSubmit = isValid && (Boolean(submittedEmail) || isVerified)
  const isSubmitDisabled = !canSubmit

  const emailChangeHandler = () => {
    setIsConfirmationOpen(false)
    setSubmittedEmail(null)
    resetRecaptcha()
  }

  const emailField = register('email', {
    validate: (value) => Boolean(value.trim()) || 'Email is required',
    onChange: emailChangeHandler,
  })

  const submitFormHandler = async ({ email }: ForgotPasswordFormValues) => {
    if (!canSubmit || !token) {
      return
    }

    const response = await fetch('/api/v1/recaptcha/verify', {
      body: JSON.stringify({ action: 'forgot_password', token }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })

    const result = (await response.json()) as { score: number; success: boolean }

    if (!result.success || result.score < 0.5) {
      resetRecaptcha()
      return
    }

    setSubmittedEmail(email.trim())
    setIsConfirmationOpen(true)
    resetRecaptcha()
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
    recaptchaContainerRef,
    submitHandler,
    submittedEmail,
  }
}

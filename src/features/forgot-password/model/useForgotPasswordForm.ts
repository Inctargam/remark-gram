import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { executeRecaptchaV3 } from '@/shared/lib/recaptcha'

import { usePasswordResetRequestMutation } from '../api/usePasswordResetRequestMutation'

type ForgotPasswordFormValues = {
  email: string
}

export const useForgotPasswordForm = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { isPending, mutateAsync } = usePasswordResetRequestMutation()

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

  const canSubmit = isValid
  const isSubmitDisabled = !canSubmit || isPending

  const emailChangeHandler = () => {
    setIsConfirmationOpen(false)
    setSubmittedEmail(null)
    setSubmitError(null)
  }

  const emailField = register('email', {
    validate: (value) => Boolean(value.trim()) || 'Email is required',
    onChange: emailChangeHandler,
  })

  const submitFormHandler = async ({ email }: ForgotPasswordFormValues) => {
    if (!canSubmit) {
      return
    }

    setSubmitError(null)

    try {
      const recaptchaToken = await executeRecaptchaV3('forgot_password')

      await mutateAsync({ email: email.trim(), recaptchaToken })

      setSubmittedEmail(email.trim())
      setIsConfirmationOpen(true)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    }
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
    isPending,
    isSubmitDisabled,
    submitError,
    submitHandler,
    submittedEmail,
  }
}

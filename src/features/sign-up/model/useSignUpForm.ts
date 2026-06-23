import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ApiError } from '@/shared/api/baseApi'

import { useRegisterMutation } from '../api/useRegisterMutation'
import type { SignUpFormValues } from './signUpFormValues'

// TODO: replace with error codes when the real backend is connected —
// matching by message string breaks if the backend wording changes.
const EMAIL_TAKEN_MSG = 'User with this email is already registered'
const USERNAME_TAKEN_MSG = 'User with this username is already registered'

export const useSignUpForm = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
    reset,
  } = useForm<SignUpFormValues>({ mode: 'onBlur' })

  const { mutate, isPending } = useRegisterMutation()

  const { username, email, password, passwordConfirmation, agreeToTerms } = watch()

  const hasAllValues =
    Boolean(username) &&
    Boolean(email) &&
    Boolean(password) &&
    Boolean(passwordConfirmation) &&
    agreeToTerms

  const isSubmitDisabled = !hasAllValues || !isValid || isPending

  const submitHandler = handleSubmit((data) => {
    mutate(
      { username: data.username, email: data.email, password: data.password },
      {
        onSuccess: () => {
          setRegisteredEmail(data.email)
          setIsSuccessModalOpen(true)
        },
        onError: (error) => {
          if (!(error instanceof ApiError) || !error.data) {
            return
          }
          const { message } = error.data

          if (message === EMAIL_TAKEN_MSG) {
            setError('email', { message })
          } else if (message === USERNAME_TAKEN_MSG) {
            setError('username', { message })
          }
        },
      }
    )
  })

  const closeModalHandler = () => {
    setIsSuccessModalOpen(false)
    reset()
  }

  return {
    register,
    control,
    errors,
    isSubmitDisabled,
    submitHandler,
    isSuccessModalOpen,
    registeredEmail,
    closeModalHandler,
  }
}

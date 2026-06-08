import { useRouter } from 'next/navigation'
import { type ChangeEvent, type FormEvent, useState } from 'react'

import { ROUTES } from '@/shared/config'

const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 20

export const useCreateNewPasswordForm = () => {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [passwordConfirmationError, setPasswordConfirmationError] = useState('')

  const isPasswordLengthValid =
    password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH
  const isSubmitDisabled = !isPasswordLengthValid || !passwordConfirmation

  const passwordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    setPasswordConfirmationError('')
  }

  const passwordConfirmationChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(event.target.value)
    setPasswordConfirmationError('')
  }

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitDisabled) {
      return
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError('The passwords must match')

      return
    }

    router.push(ROUTES.signIn)
  }

  return {
    isSubmitDisabled,
    password,
    passwordChangeHandler,
    passwordConfirmation,
    passwordConfirmationChangeHandler,
    passwordConfirmationError,
    submitHandler,
  }
}

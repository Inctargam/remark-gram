import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { ROUTES } from '@/shared/config'

type CreateNewPasswordFormValues = {
  newPassword: string
  passwordConfirmation: string
}

const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 20
const PASSWORD_LENGTH_ERROR = 'Your password must be between 6 and 20 characters'
const PASSWORDS_MATCH_ERROR = 'The passwords must match'

export const useCreateNewPasswordForm = () => {
  const router = useRouter()

  const {
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    register,
    trigger,
  } = useForm<CreateNewPasswordFormValues>({
    defaultValues: {
      newPassword: '',
      passwordConfirmation: '',
    },
    mode: 'onChange',
  })

  const newPasswordField = register('newPassword', {
    maxLength: {
      message: PASSWORD_LENGTH_ERROR,
      value: MAX_PASSWORD_LENGTH,
    },
    minLength: {
      message: PASSWORD_LENGTH_ERROR,
      value: MIN_PASSWORD_LENGTH,
    },
    onChange: () => {
      if (getValues('passwordConfirmation')) {
        void trigger('passwordConfirmation')
      }
    },
    required: PASSWORD_LENGTH_ERROR,
  })

  const passwordConfirmationField = register('passwordConfirmation', {
    required: 'Password confirmation is required',
    validate: (value) => value === getValues('newPassword') || PASSWORDS_MATCH_ERROR,
  })

  const submitFormHandler = () => {
    router.push(ROUTES.signIn)
  }

  const submitHandler = handleSubmit(submitFormHandler)

  return {
    isSubmitDisabled: !isValid,
    newPasswordError: errors.newPassword?.message,
    newPasswordField,
    passwordConfirmationError: errors.passwordConfirmation?.message,
    passwordConfirmationField,
    submitHandler,
  }
}

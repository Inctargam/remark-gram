import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { PASSWORD_CREATION_RULES } from '@/entities/auth'
import { ROUTES } from '@/shared/config'

import type { CreateNewPasswordFormValues } from './createNewPasswordFormValues'
import { PASSWORD_CONFIRMATION_RULES } from './validationRules'

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
    mode: 'onBlur',
  })

  const newPasswordField = register('newPassword', {
    ...PASSWORD_CREATION_RULES,
    onChange: () => {
      if (getValues('passwordConfirmation')) {
        void trigger('passwordConfirmation')
      }
    },
  })

  const passwordConfirmationField = register('passwordConfirmation', PASSWORD_CONFIRMATION_RULES)

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

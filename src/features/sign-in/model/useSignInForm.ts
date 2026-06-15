import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { ApiError } from '@/shared/api/baseApi'
import { ROUTES } from '@/shared/config'

import { useLoginMutation } from '../api/useLoginMutation'
import type { SignInFormValues } from './signInFormValues'

const INVALID_CREDENTIALS_MSG = 'Invalid email or password'

export const useSignInForm = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
  } = useForm<SignInFormValues>({ mode: 'onBlur' })

  const { mutate, isPending } = useLoginMutation()

  const { email, password } = watch()

  const hasAllValues = Boolean(email) && Boolean(password)

  const isSubmitDisabled = !hasAllValues || !isValid || isPending

  const submitHandler = handleSubmit((data) => {
    mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.push(ROUTES.profile)
        },
        onError: (error) => {
          if (!(error instanceof ApiError) || !error.data) {
            return
          }
          const { message } = error.data

          if (message === INVALID_CREDENTIALS_MSG) {
            setError('email', { message })
          }
        },
      }
    )
  })

  return {
    register,
    errors,
    isSubmitDisabled,
    submitHandler,
  }
}

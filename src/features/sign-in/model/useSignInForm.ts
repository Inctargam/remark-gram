import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { ApiError } from '@/shared/api/baseApi'
import {
  hasRecentCurrentUserLoadFailure,
  loadCurrentUser,
  refreshSession,
  sessionStore,
} from '@/shared/auth'
import { ROUTES } from '@/shared/config'

import { useLoginMutation } from '../api/useLoginMutation'
import type { SignInFormValues } from './signInFormValues'

const INVALID_CREDENTIALS_MSG = 'Invalid email or password'
const PROFILE_LOAD_FAILED_MSG = 'Unable to load your profile. Please try again later.'
const USER_ALREADY_LOGGED_IN_CODE = 'USER_ALREADY_LOGGED_IN'

export const useSignInForm = () => {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [isSessionResolving, setIsSessionResolving] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setError,
  } = useForm<SignInFormValues>({ mode: 'onBlur' })

  const { mutate, isPending } = useLoginMutation()

  const email = useWatch({ control, name: 'email' })
  const password = useWatch({ control, name: 'password' })

  const hasAllValues = Boolean(email) && Boolean(password)

  const isSubmitDisabled = !hasAllValues || !isValid || isPending || isSessionResolving

  const redirectToProfileHandler = async (resolveSession: () => Promise<unknown>) => {
    setIsSessionResolving(true)
    setFormError(null)

    try {
      const currentUser = await resolveSession()

      if (!currentUser) {
        setFormError(PROFILE_LOAD_FAILED_MSG)

        return
      }

      router.push(ROUTES.profile)
    } catch {
      setFormError(PROFILE_LOAD_FAILED_MSG)
    } finally {
      setIsSessionResolving(false)
    }
  }

  const submitHandler = handleSubmit((data) => {
    setFormError(null)

    mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: ({ accessToken }) => {
          sessionStore.getState().setAuthenticated(accessToken)
          void redirectToProfileHandler(loadCurrentUser)
        },
        onError: (error) => {
          if (!(error instanceof ApiError) || !error.data) {
            return
          }
          const { code, message } = error.data

          if (code === USER_ALREADY_LOGGED_IN_CODE) {
            if (hasRecentCurrentUserLoadFailure() && sessionStore.getState().accessToken) {
              setFormError(PROFILE_LOAD_FAILED_MSG)

              return
            }

            void redirectToProfileHandler(refreshSession)

            return
          }

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
    formError,
    isSubmitDisabled,
    isSessionResolving,
    submitHandler,
  }
}

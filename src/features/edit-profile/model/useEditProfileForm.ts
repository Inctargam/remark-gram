import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { updateCurrentProfileCaches, useProfileQuery } from '@/entities/profile'

import { ProfileUpdateError } from '../api/editProfileApi'
import { useUpdateProfileMutation } from '../api/useUpdateProfileMutation'
import {
  clearEditProfileDraft,
  consumeEditProfileDraft,
  saveEditProfileDraft,
} from './editProfileDraft'
import { type EditProfileFormValues, EMPTY_EDIT_PROFILE_FORM_VALUES } from './editProfileFormValues'
import { mapProfileToFormValues } from './editProfileMappers'
import { getProfileValidationField } from './getProfileValidationField'
import { useProfileLocationFields } from './useProfileLocationFields'

type SubmitAlert =
  | { variant: 'success'; message: string }
  | { variant: 'error'; message: string }
  | null

export const useEditProfileForm = () => {
  const queryClient = useQueryClient()
  const [submitAlert, setSubmitAlert] = useState<SubmitAlert>(null)
  const [isFormInitialized, setIsFormInitialized] = useState(false)
  const isInitializedRef = useRef(false)
  const profileQuery = useProfileQuery()
  const updateMutation = useUpdateProfileMutation()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    getValues,
    reset,
    setError,
    trigger,
  } = useForm<EditProfileFormValues>({
    defaultValues: EMPTY_EDIT_PROFILE_FORM_VALUES,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })
  const locationFields = useProfileLocationFields({ control, profile: profileQuery.data })

  useEffect(() => {
    if (!profileQuery.data || isInitializedRef.current) {
      return
    }

    const profileValues = mapProfileToFormValues(profileQuery.data)
    const draft = consumeEditProfileDraft()

    // Keep the server profile as the dirty-state baseline, then restore the one-time draft
    // without replacing those defaults.
    reset(profileValues)

    if (draft) {
      reset(draft, { keepDefaultValues: true })
    }

    isInitializedRef.current = true
    setIsFormInitialized(true)
  }, [profileQuery.data, reset])

  useEffect(() => {
    if (isFormInitialized) {
      // Validate after reset has propagated to the mounted fields.
      void trigger()
    }
  }, [isFormInitialized, trigger])

  const submitHandler = handleSubmit((formValues) => {
    setSubmitAlert(null)

    updateMutation.mutate(formValues, {
      onSuccess: async () => {
        clearEditProfileDraft()
        const refreshedProfile = await profileQuery.refetch()

        if (!refreshedProfile.data || refreshedProfile.isError) {
          setSubmitAlert({
            variant: 'error',
            message: 'Settings were saved, but the updated profile could not be loaded.',
          })
          return
        }

        updateCurrentProfileCaches(queryClient, refreshedProfile.data)
        reset(mapProfileToFormValues(refreshedProfile.data))
        setSubmitAlert({ variant: 'success', message: 'Your settings are saved!' })
      },
      onError: (error) => {
        if (error instanceof ProfileUpdateError) {
          if (error.status === 409) {
            setError('username', { type: 'server', message: error.message })
            return
          }

          if (error.status === 400) {
            const fieldMessages = new Map<keyof EditProfileFormValues, string[]>()
            const generalMessages: string[] = []

            for (const message of error.messages) {
              const field = getProfileValidationField(message)

              if (field) {
                fieldMessages.set(field, [...(fieldMessages.get(field) ?? []), message])
              } else {
                generalMessages.push(message)
              }
            }

            for (const [field, messages] of fieldMessages) {
              setError(field, { type: 'server', message: messages.join('; ') })
            }

            if (generalMessages.length === 0) {
              return
            }

            setSubmitAlert({ variant: 'error', message: generalMessages.join('; ') })
            return
          }
        }

        setSubmitAlert({
          variant: 'error',
          message: error instanceof Error ? error.message : 'Failed to save profile settings.',
        })
      },
    })
  })

  const privacyPolicyClickHandler = () => {
    saveEditProfileDraft(getValues())
  }

  const closeAlertHandler = () => {
    setSubmitAlert(null)
  }

  return {
    profile: profileQuery.data,
    profileLoadError: profileQuery.isError && !profileQuery.data,
    reloadProfile: profileQuery.refetch,
    register,
    control,
    errors,
    isSubmitDisabled: !isDirty || !isValid || updateMutation.isPending || profileQuery.isFetching,
    locationFields,
    submitHandler,
    privacyPolicyClickHandler,
    submitAlert,
    closeAlertHandler,
  }
}

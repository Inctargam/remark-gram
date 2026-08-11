import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useProfileQuery } from '@/entities/profile'

import { useUpdateProfileMutation } from '../api/useUpdateProfileMutation'
import {
  clearEditProfileDraft,
  consumeEditProfileDraft,
  saveEditProfileDraft,
} from './editProfileDraft'
import { type EditProfileFormValues, EMPTY_EDIT_PROFILE_FORM_VALUES } from './editProfileFormValues'
import { mapFormValuesToPayload, mapProfileToFormValues } from './editProfileMappers'
import { useProfileLocationFields } from './useProfileLocationFields'

type SubmitAlert =
  | { variant: 'success'; message: string }
  | { variant: 'error'; message: string }
  | null

export const useEditProfileForm = () => {
  const [submitAlert, setSubmitAlert] = useState<SubmitAlert>(null)
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
    trigger,
  } = useForm<EditProfileFormValues>({
    defaultValues: EMPTY_EDIT_PROFILE_FORM_VALUES,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })
  const locationFields = useProfileLocationFields({ control })

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
    // Let reset propagate through React Hook Form before validating the restored values.
    const validationTimeout = window.setTimeout(() => void trigger(), 0)

    return () => window.clearTimeout(validationTimeout)
  }, [profileQuery.data, reset, trigger])

  const submitHandler = handleSubmit((formValues) => {
    setSubmitAlert(null)

    updateMutation.mutate(mapFormValuesToPayload(formValues), {
      onSuccess: (profile) => {
        clearEditProfileDraft()
        reset(mapProfileToFormValues(profile))
        setSubmitAlert({ variant: 'success', message: 'Your settings are saved!' })
      },
      onError: (error) => {
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
    register,
    control,
    errors,
    isSubmitDisabled: !isDirty || !isValid || updateMutation.isPending,
    locationFields,
    submitHandler,
    privacyPolicyClickHandler,
    submitAlert,
    closeAlertHandler,
  }
}

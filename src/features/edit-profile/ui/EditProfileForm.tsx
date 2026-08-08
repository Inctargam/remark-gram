'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Controller } from 'react-hook-form'

import { ROUTES } from '@/shared/config'
import { Alert } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Combobox } from '@/shared/ui/combobox'
import { DatePicker } from '@/shared/ui/date-picker'
import { Input } from '@/shared/ui/input'
import { TextArea } from '@/shared/ui/textarea'

import { useEditProfileForm } from '../model/useEditProfileForm'
import {
  ABOUT_ME_RULES,
  DATE_OF_BIRTH_RULES,
  FIRST_NAME_RULES,
  LAST_NAME_RULES,
  USERNAME_RULES,
} from '../model/validationRules'
import styles from './EditProfileForm.module.css'

type Props = {
  avatar: ReactNode
}

export const EditProfileForm = ({ avatar }: Props) => {
  const {
    profile,
    register,
    control,
    errors,
    isSubmitDisabled,
    locationFields,
    submitHandler,
    privacyPolicyClickHandler,
    submitAlert,
    closeAlertHandler,
  } = useEditProfileForm()

  if (!profile) {
    return null
  }

  const dateOfBirthError = errors.dateOfBirth?.message

  return (
    <form className={styles.form} noValidate onSubmit={submitHandler}>
      <div className={styles.profileContent}>
        {avatar}

        <div className={styles.fields}>
          <Input
            error={errors.username?.message}
            label={
              <>
                Username<span className={styles.requiredMark}>*</span>
              </>
            }
            required
            {...register('username', USERNAME_RULES)}
          />

          <Input
            error={errors.firstName?.message}
            label={
              <>
                First Name<span className={styles.requiredMark}>*</span>
              </>
            }
            required
            {...register('firstName', FIRST_NAME_RULES)}
          />

          <Input
            error={errors.lastName?.message}
            label={
              <>
                Last Name<span className={styles.requiredMark}>*</span>
              </>
            }
            required
            {...register('lastName', LAST_NAME_RULES)}
          />

          <Controller
            control={control}
            name="dateOfBirth"
            rules={DATE_OF_BIRTH_RULES}
            render={({ field }) => (
              <DatePicker
                ariaLabel="Date of birth"
                className={styles.dateField}
                error={
                  dateOfBirthError ? (
                    <>
                      {dateOfBirthError}{' '}
                      <Link
                        className={styles.privacyPolicyLink}
                        href={ROUTES.privacyPolicy}
                        onClick={privacyPolicyClickHandler}>
                        Privacy Policy
                      </Link>
                    </>
                  ) : undefined
                }
                label="Date of birth"
                mode="single"
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder="dd.mm.yyyy"
                value={field.value}
              />
            )}
          />

          <div className={styles.locationFields}>
            <Combobox
              label="Select your country"
              placeholder="Country"
              {...locationFields.country}
            />

            <Combobox label="Select your city" placeholder="City" {...locationFields.city} />
          </div>

          <TextArea
            className={styles.aboutField}
            error={errors.aboutMe?.message}
            label="About Me"
            {...register('aboutMe', ABOUT_ME_RULES)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button className={styles.saveButton} disabled={isSubmitDisabled} type="submit">
          Save Changes
        </Button>
      </div>

      {submitAlert && (
        <Alert
          className={styles.submitAlert}
          onClose={closeAlertHandler}
          variant={submitAlert.variant}>
          {submitAlert.variant === 'error' ? (
            <>
              <b>Error!</b> {submitAlert.message}
            </>
          ) : (
            submitAlert.message
          )}
        </Alert>
      )}
    </form>
  )
}

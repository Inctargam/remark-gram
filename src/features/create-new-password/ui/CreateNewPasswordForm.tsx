'use client'

import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'

import { useCreateNewPasswordForm } from '../model/useCreateNewPasswordForm'
import styles from './CreateNewPasswordForm.module.css'

export const CreateNewPasswordForm = () => {
  const {
    isSubmitDisabled,
    newPasswordError,
    newPasswordField,
    passwordConfirmationError,
    passwordConfirmationField,
    submitHandler,
  } = useCreateNewPasswordForm()

  return (
    <Card className={styles.card} padding="medium">
      <form className={styles.form} onSubmit={submitHandler}>
        <h1 className={styles.title}>Create New Password</h1>

        <div className={styles.fields}>
          <Input
            error={newPasswordError}
            label="New password"
            placeholder="******************"
            type="password"
            {...newPasswordField}
          />
          <Input
            error={passwordConfirmationError}
            label="Password confirmation"
            placeholder="******************"
            type="password"
            {...passwordConfirmationField}
          />
        </div>

        <p className={styles.passwordHint}>Your password must be between 6 and 20 characters</p>

        <Button
          className={styles.submitButton}
          disabled={isSubmitDisabled}
          type="submit"
          variant="primary">
          Create new password
        </Button>
      </form>
    </Card>
  )
}

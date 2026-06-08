'use client'

import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'

import { useCreateNewPasswordForm } from '../model/useCreateNewPasswordForm'
import styles from './CreateNewPasswordForm.module.css'

export const CreateNewPasswordForm = () => {
  const {
    isSubmitDisabled,
    password,
    passwordChangeHandler,
    passwordConfirmation,
    passwordConfirmationChangeHandler,
    passwordConfirmationError,
    submitHandler,
  } = useCreateNewPasswordForm()

  return (
    <Card className={styles.card} padding="medium">
      <form className={styles.form} onSubmit={submitHandler}>
        <h1 className={styles.title}>Create New Password</h1>

        <div className={styles.fields}>
          <Input
            label="New password"
            name="newPassword"
            onChange={passwordChangeHandler}
            placeholder="******************"
            type="password"
            value={password}
          />
          <Input
            error={passwordConfirmationError}
            label="Password confirmation"
            name="passwordConfirmation"
            onChange={passwordConfirmationChangeHandler}
            placeholder="******************"
            type="password"
            value={passwordConfirmation}
          />
        </div>

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

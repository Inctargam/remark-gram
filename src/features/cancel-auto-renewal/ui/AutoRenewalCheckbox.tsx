'use client'

import { Checkbox } from '@/shared/ui/checkbox'

import { useAutoRenewalMutation } from '../api/useAutoRenewalMutation'
import styles from './autoRenewalCheckbox.module.css'

const ERROR_MESSAGE = 'Failed to change auto-renewal. Please try again.'

type Props = {
  /**
   * State of the queue tail — the only subscription that may renew (Р5). It comes from the
   * cache, which the mutation updates optimistically, so the box moves on the click.
   */
  checked: boolean
}

export const AutoRenewalCheckbox = ({ checked }: Props) => {
  const { isError, mutate } = useAutoRenewalMutation()

  // Not `mutate` itself: base-ui passes event details as the second argument, and the
  // mutation reads that position as its options object.
  const autoRenewalChangeHandler = (nextChecked: boolean) => mutate(nextChecked)

  return (
    <div className={styles.root}>
      <Checkbox checked={checked} onCheckedChange={autoRenewalChangeHandler}>
        Auto-Renewal
      </Checkbox>

      {isError ? (
        <span className={styles.error} role="alert">
          {ERROR_MESSAGE}
        </span>
      ) : null}
    </div>
  )
}

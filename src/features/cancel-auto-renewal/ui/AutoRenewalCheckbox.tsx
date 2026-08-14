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
  const { isError, isPending, mutate } = useAutoRenewalMutation()

  // Not `mutate` itself: base-ui passes event details as the second argument, and the
  // mutation reads that position as its options object. Also guards `isPending` here rather
  // than trusting `disabled` alone — that attribute commits a render behind this state, so a
  // click fired before it lands would otherwise still reach `mutate`.
  const autoRenewalChangeHandler = (nextChecked: boolean) => {
    if (isPending) {
      return
    }

    mutate(nextChecked)
  }

  return (
    <div className={styles.root}>
      {/* Disabled while a request is in flight — a second click before the response lands
          would read `previousStatus` from an already-optimistic cache and could race. */}
      <Checkbox checked={checked} disabled={isPending} onCheckedChange={autoRenewalChangeHandler}>
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

'use client'

import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Modal } from '@/shared/ui/modal'

import styles from './buySubscription.module.css'

/** Wording of UC-1 step 10, taken from the `Create payment` frame of the design. */
export const PAYMENT_CONSENT_TITLE = 'Create payment'
export const PAYMENT_CONSENT_MESSAGE =
  'Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings'

type Props = {
  open: boolean
  /** While the session is being created the modal stays put and `OK` is locked. */
  isPending: boolean
  onConfirm: () => void
  /** Closing by the cross or the backdrop cancels the payment (UC-1 step 10). */
  onOpenChange: (open: boolean) => void
}

export const PaymentConsentModal = ({ open, isPending, onConfirm, onOpenChange }: Props) => {
  const [isAgreed, setIsAgreed] = useState(false)

  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen) {
      // The next payment starts from an unchecked box, no matter how this one ended.
      setIsAgreed(false)
    }

    onOpenChange(nextOpen)
  }

  return (
    <Modal
      className={styles.modal}
      open={open}
      onOpenChange={openChangeHandler}
      title={PAYMENT_CONSENT_TITLE}>
      <p className={styles.message}>{PAYMENT_CONSENT_MESSAGE}</p>

      <div className={styles.consentActions}>
        <Checkbox checked={isAgreed} disabled={isPending} onCheckedChange={setIsAgreed}>
          I agree
        </Checkbox>
        <Button
          className={styles.consentConfirm}
          type="button"
          disabled={!isAgreed || isPending}
          onClick={onConfirm}>
          OK
        </Button>
      </div>
    </Modal>
  )
}

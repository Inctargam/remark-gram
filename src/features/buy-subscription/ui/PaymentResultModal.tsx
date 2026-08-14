'use client'

import type { CheckoutOutcome } from '@/entities/subscription'
import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'

import styles from './buySubscription.module.css'

/** Both frames of the result: title, one line of text and a single full-width button. */
const RESULT_CONTENT: Record<CheckoutOutcome, { title: string; message: string; action: string }> =
  {
    success: {
      title: 'Success',
      message: 'Payment was successful!',
      action: 'OK',
    },
    failed: {
      title: 'Error',
      message: 'Transaction failed. Please, write to support',
      action: 'Back to payment',
    },
  }

type Props = {
  /** `null` keeps the modal closed — it is the same "no result yet" the url carries. */
  outcome: CheckoutOutcome | null
  onClose: () => void
}

export const PaymentResultModal = ({ outcome, onClose }: Props) => {
  // Keep the last outcome out of the closed state: with `null` there is nothing to render.
  if (!outcome) {
    return null
  }

  const { title, message, action } = RESULT_CONTENT[outcome]

  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose()
    }
  }

  return (
    <Modal className={styles.modal} open onOpenChange={openChangeHandler} title={title}>
      <p className={styles.message}>{message}</p>
      <Button className={styles.resultAction} type="button" onClick={onClose}>
        {action}
      </Button>
    </Modal>
  )
}

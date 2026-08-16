'use client'

import { useState } from 'react'

import type { PaymentProvider } from '@/entities/subscription'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Icon } from '@/shared/ui/icon'
import { Modal } from '@/shared/ui/modal'

import styles from './buySubscription.module.css'

/** Wording of UC-1 step 10, taken from the `Create payment` frame of the design. */
export const PAYMENT_CONSENT_TITLE = 'Create payment'
export const PAYMENT_CONSENT_MESSAGE =
  'Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings'

/** The payment providers' brand logos, rendered next to the consent title. */
const PROVIDER_ICON_IDS: Record<PaymentProvider, string> = {
  paypal: 'icon-paypal',
  stripe: 'icon-stripe',
}

type Props = {
  open: boolean
  /** The provider the payment is created with — shown as the brand logo in the header. */
  provider: PaymentProvider
  /**
   * Locked from the confirm click through to the actual redirect (see `isCheckoutPending`) —
   * not only while the session-creation request is in flight. `OK` stays disabled and the
   * modal stays put for the whole window.
   */
  isPending: boolean
  onConfirm: () => void
  /** Closing by the cross or the backdrop cancels the payment (UC-1 step 10). */
  onOpenChange: (open: boolean) => void
}

export const PaymentConsentModal = ({
  open,
  provider,
  isPending,
  onConfirm,
  onOpenChange,
}: Props) => {
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
      title={PAYMENT_CONSENT_TITLE}
      // Blocks backdrop, cross and Escape for the whole confirm-to-redirect window (see `isPending`).
      dismissDisabled={isPending}>
      <Icon
        className={styles.providerIcon}
        iconId={PROVIDER_ICON_IDS[provider]}
        width={48}
        height={32}
        viewBox="0 0 24 16"
        fill="none"
      />
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

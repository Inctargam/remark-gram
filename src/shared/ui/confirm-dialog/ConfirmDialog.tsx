'use client'

import type { ReactNode } from 'react'

import { Button } from '@/shared/ui/button'
import { Modal } from '@/shared/ui/modal'

import styles from './ConfirmDialog.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Blocks the confirm button while the confirmed action is still running. */
  confirmDisabled?: boolean
  /**
   * Whether confirming closes the dialog by itself.
   * Turn off for an asynchronous action: the dialog has to stay until the request resolves,
   * otherwise a failure has nowhere to be reported. The owner then closes it on success.
   */
  closeOnConfirm?: boolean
  /** Class for the popup — for dialogs whose width differs from the default one. */
  className?: string
  onConfirm: () => void
  /** Called on cancel button, close icon and any other dismissal. */
  onCancel?: () => void
  /**
   * Blocks closing by clicking outside the dialog.
   * On by default: a confirmation must be answered, not dismissed by a stray click.
   */
  disablePointerDismissal?: boolean
}

export type { Props as ConfirmDialogProps }

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  confirmDisabled = false,
  closeOnConfirm = true,
  className,
  onConfirm,
  onCancel,
  disablePointerDismissal = true,
}: Props) => {
  // Every dismissal path (close icon, Escape, outside click) funnels through onOpenChange.
  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen) {
      onCancel?.()
    }
    onOpenChange(nextOpen)
  }

  const confirmHandler = () => {
    onConfirm()

    if (closeOnConfirm) {
      onOpenChange(false)
    }
  }

  const cancelHandler = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Modal
      className={className}
      open={open}
      onOpenChange={openChangeHandler}
      title={title}
      disablePointerDismissal={disablePointerDismissal}>
      <div className={styles.message}>{message}</div>
      <div className={styles.actions}>
        <Button variant="outline" disabled={confirmDisabled} onClick={confirmHandler}>
          {confirmLabel}
        </Button>
        <Button variant="primary" onClick={cancelHandler}>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  )
}

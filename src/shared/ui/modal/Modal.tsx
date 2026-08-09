'use client'

import { Dialog } from '@base-ui/react/dialog'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import { Icon } from '@/shared/ui/icon'

import styles from './Modal.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  className?: string
  /** Class for the body wrapper — for dialogs whose content must ignore the default padding. */
  bodyClassName?: string
  disablePointerDismissal?: boolean
  /** Blocks every dismissal path while an irreversible action is pending. */
  dismissDisabled?: boolean
}

export type { Props as ModalProps }

export const Modal = ({
  open,
  onOpenChange,
  title,
  children,
  className,
  bodyClassName,
  disablePointerDismissal = false,
  dismissDisabled = false,
}: Props) => {
  const openChangeHandler = (nextOpen: boolean) => {
    if (!nextOpen && dismissDisabled) {
      return
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={openChangeHandler}
      disablePointerDismissal={disablePointerDismissal || dismissDisabled}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={clsx(styles.popup, className)}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="Close" disabled={dismissDisabled}>
              <Icon iconId="icon-close-outline" width={24} height={24} />
            </Dialog.Close>
          </div>
          <div className={clsx(styles.body, bodyClassName)}>{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

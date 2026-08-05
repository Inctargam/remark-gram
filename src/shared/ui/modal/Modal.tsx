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
  headerStart?: ReactNode
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
  headerStart,
}: Props) => (
  <Dialog.Root
    open={open}
    onOpenChange={onOpenChange}
    disablePointerDismissal={disablePointerDismissal}>
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.backdrop} />
      <Dialog.Popup className={clsx(styles.popup, className)}>
        <div className={styles.header} data-has-start={headerStart ? true : undefined}>
          {headerStart ? <div className={styles.headerStart}>{headerStart}</div> : null}
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          <Dialog.Close className={styles.close} aria-label="Close">
            <Icon iconId="icon-close-outline" width={24} height={24} />
          </Dialog.Close>
        </div>
        <div className={clsx(styles.body, bodyClassName)}>{children}</div>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
)

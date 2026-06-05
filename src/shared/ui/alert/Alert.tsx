import clsx from 'clsx'
import React from 'react'

import { Icon } from '@/shared/ui/icon'

import styles from './Alert.module.css'

export type AlertVariant = 'error' | 'success' | 'warning' | 'info'

export type AlertProps = {
  variant: AlertVariant
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

export const Alert = ({ variant, children, onClose, className }: AlertProps) => {
  return (
    <div
      role="alert"
      className={clsx(styles.alert, styles[variant], !onClose && styles.centered, className)}>
      <div className={styles.content}>{children}</div>

      {onClose && (
        <button
          className={styles.closeButton}
          onClick={onClose}
          type="button"
          aria-label="Close alert">
          <Icon iconId="icon-close-outline" width={24} height={24} />
        </button>
      )}
    </div>
  )
}

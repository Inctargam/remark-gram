import type { CheckboxRootProps } from '@base-ui/react/checkbox'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import clsx from 'clsx'
import type { ReactNode } from 'react'

import styles from './checkbox.module.css'

export type CheckboxProps = {
  children?: ReactNode
  className?: string
  controlClassName?: string
  labelClassName?: string
} & Omit<CheckboxRootProps, 'children' | 'className'>

export const Checkbox = ({
  children,
  className,
  controlClassName,
  labelClassName,
  disabled,
  ...props
}: CheckboxProps) => (
  <BaseCheckbox.Root
    className={clsx(styles.root, !children && styles.iconOnly, className)}
    disabled={disabled}
    {...props}>
    <span className={clsx(styles.control, controlClassName)} aria-hidden="true">
      <BaseCheckbox.Indicator className={styles.indicator} />
    </span>

    {children && <span className={clsx(styles.label, labelClassName)}>{children}</span>}
  </BaseCheckbox.Root>
)

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
}: CheckboxProps) => {
  const control = (
    <BaseCheckbox.Root
      className={clsx(styles.control, controlClassName)}
      disabled={disabled}
      {...props}>
      <BaseCheckbox.Indicator className={styles.indicator} />
    </BaseCheckbox.Root>
  )

  if (!children) {
    return control
  }

  return (
    <label className={clsx(styles.root, className)} data-disabled={disabled || undefined}>
      {control}
      <span className={clsx(styles.label, labelClassName)}>{children}</span>
    </label>
  )
}

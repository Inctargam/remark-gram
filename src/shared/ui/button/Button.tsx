import type { ButtonProps as BaseButtonProps } from '@base-ui/react/button'
import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'

import styles from './button.module.css'

type Variant = 'primary' | 'secondary' | 'outline' | 'text'

export type ButtonProps = {
  variant?: Variant
  // Override className to plain string — BaseUI's className accepts an object with state flags,
  // but we manage states via CSS [data-*] selectors so a plain string is sufficient here.
  className?: string
} & Omit<BaseButtonProps, 'className'>

export const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => (
  <BaseButton className={clsx(styles.button, styles[variant], className)} {...props} />
)

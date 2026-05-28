import type { ButtonProps as BaseButtonProps } from '@base-ui/react/button'
import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'

import styles from './button.module.css'

type Variant = 'primary' | 'secondary' | 'outline' | 'text'

export type ButtonProps = {
  variant?: Variant
  className?: string
} & Omit<BaseButtonProps, 'className'>

export const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => (
  <BaseButton className={clsx(styles.button, styles[variant], className)} {...props} />
)

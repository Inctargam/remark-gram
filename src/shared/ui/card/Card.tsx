import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'

import styles from './card.module.css'

type Padding = 'none' | 'small' | 'medium' | 'large'

export type CardProps = {
  children?: ReactNode
  padding?: Padding
  className?: string
} & HTMLAttributes<HTMLDivElement>

export const Card = ({ children, padding = 'medium', className, ...props }: CardProps) => (
  <div className={clsx(styles.root, styles[padding], className)} {...props}>
    {children}
  </div>
)

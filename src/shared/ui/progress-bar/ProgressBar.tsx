import clsx from 'clsx'

import styles from './ProgressBar.module.css'

type Props = {
  isLoading: boolean
  className?: string
}

export const ProgressBar = ({ isLoading, className }: Props) => (
  <div
    className={clsx(styles.bar, isLoading && styles.active, className)}
    role="progressbar"
    aria-hidden={!isLoading}
  />
)

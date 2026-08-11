import { Progress } from '@base-ui/react/progress'
import clsx from 'clsx'

import styles from './ProgressBar.module.css'

type Props = {
  isLoading: boolean
  className?: string
}

export const ProgressBar = ({ isLoading, className }: Props) => (
  <Progress.Root value={isLoading ? null : 100} className={clsx(styles.root, className)}>
    <Progress.Track className={styles.track}>
      <Progress.Indicator className={styles.indicator} />
    </Progress.Track>
  </Progress.Root>
)

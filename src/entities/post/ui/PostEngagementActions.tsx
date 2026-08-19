import clsx from 'clsx'

import { Icon } from '@/shared/ui/icon'

import styles from './postView.module.css'

export const PostEngagementActions = () => (
  <div className={styles.actions}>
    <button className={styles.action} type="button" aria-label="Like" disabled>
      <Icon iconId="icon-heart-outline" width={24} height={24} />
    </button>
    <button className={styles.action} type="button" aria-label="Share" disabled>
      <Icon iconId="icon-paper-plane-outline" width={24} height={24} />
    </button>
    <button
      className={clsx(styles.action, styles.bookmark)}
      type="button"
      aria-label="Save"
      disabled>
      <Icon iconId="icon-bookmark-outline" width={24} height={24} />
    </button>
  </div>
)

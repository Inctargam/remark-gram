import clsx from 'clsx'

import { Icon } from '@/shared/ui/icon'

import styles from './postStubs.module.css'

const LIKE_AVATAR_KEYS = ['first', 'second', 'third'] as const

/**
 * TODO(likes): placeholder for the like/share/bookmark row and the likes counter.
 * Every control is disabled: the features behind them do not exist, and an enabled
 * button would read as broken rather than as unfinished.
 */
export const PostEngagementStub = () => (
  <div className={styles.engagement}>
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

    <div className={styles.likes}>
      <span className={styles.likeAvatars} aria-hidden="true">
        {LIKE_AVATAR_KEYS.map((key) => (
          <span className={styles.likeAvatar} key={key} />
        ))}
      </span>
      {/* Wording copied from the design as is, quotes included. */}
      <span>
        <span className={styles.likeCount}>2 243</span> &quot;Like&quot;
      </span>
    </div>
  </div>
)

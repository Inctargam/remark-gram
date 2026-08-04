import clsx from 'clsx'
import Image from 'next/image'
import type { ReactNode } from 'react'

import type { Post } from '../model/types'
import styles from './postAuthor.module.css'

type Props = {
  post: Post
  /**
   * Owner-only controls (the three-dot menu from `features/post-actions`).
   * The entity does not decide who the owner is — the caller passes the slot or nothing.
   */
  actions?: ReactNode
  /** Class for the row itself: every screen frames the same author row differently. */
  className?: string
}

/**
 * Avatar and username of the post author.
 * Viewing a post and editing it show the same row, so it lives in the entity
 * instead of being spelled out in both screens.
 */
export const PostAuthor = ({ post, actions, className }: Props) => (
  <div className={clsx(styles.author, className)}>
    <span className={styles.avatar}>
      {post.ownerAvatarUrl ? (
        <Image
          className={styles.avatarImage}
          src={post.ownerAvatarUrl}
          alt=""
          fill
          sizes="36px"
          unoptimized
        />
      ) : null}
    </span>
    <span className={styles.username}>{post.ownerUsername}</span>
    {actions ? <div className={styles.actions}>{actions}</div> : null}
  </div>
)

'use client'

import type { ReactNode } from 'react'

import { Scroll } from '@/shared/ui/scroll'

import { formatPostDate } from '../lib/formatPostDate'
import { formatPostRelativeTime } from '../lib/formatPostRelativeTime'
import type { Post } from '../model/types'
import { PostAuthor } from './PostAuthor'
import { PostGallery } from './PostGallery'
import styles from './postView.module.css'
import { PostCommentFormStub } from './stubs/PostCommentFormStub'
import { PostCommentsStub } from './stubs/PostCommentsStub'
import { PostEngagementStub } from './stubs/PostEngagementStub'

type Props = {
  post: Post
  /**
   * Owner-only controls (the three-dot menu from `features/post-actions`).
   * The entity does not decide who the owner is — the caller passes the slot or nothing.
   */
  actions?: ReactNode
}

export const PostView = ({ post, actions }: Props) => {
  const publishedAt = formatPostDate(post.createdAt)
  const postedAgo = formatPostRelativeTime(post.createdAt)

  return (
    <div className={styles.post}>
      {/* Keyed by post: a different publication must start from its first photo. */}
      <PostGallery post={post} key={post.id} />

      <div className={styles.side}>
        <PostAuthor className={styles.author} post={post} actions={actions} />

        <Scroll className={styles.content}>
          {post.description ? (
            <div className={styles.description}>
              <span className={styles.descriptionAvatar} aria-hidden="true" />
              <div className={styles.descriptionBody}>
                <p className={styles.descriptionText}>
                  <span className={styles.descriptionAuthor}>{post.ownerUsername}</span>
                  {post.description}
                </p>
                {postedAgo ? <p className={styles.descriptionTime}>{postedAgo}</p> : null}
              </div>
            </div>
          ) : null}

          <PostCommentsStub />
        </Scroll>

        <div className={styles.footer}>
          <div className={styles.engagement}>
            <PostEngagementStub />
            {/* Real data next to the stubs: the date must survive deleting `ui/stubs/`. */}
            {publishedAt ? <p className={styles.publishedAt}>{publishedAt}</p> : null}
          </div>

          <div className={styles.commentForm}>
            <PostCommentFormStub />
          </div>
        </div>
      </div>
    </div>
  )
}

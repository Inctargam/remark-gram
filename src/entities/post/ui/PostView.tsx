'use client'

import type { ReactNode } from 'react'

import { Scroll } from '@/shared/ui/scroll'

import { formatPostDate } from '../lib/formatPostDate'
import { formatPostRelativeTime } from '../lib/formatPostRelativeTime'
import type { Post } from '../model/types'
import { usePostComments } from '../model/usePostComments'
import { PostAuthor } from './PostAuthor'
import { PostCommentForm } from './PostCommentForm'
import { PostComments } from './PostComments'
import { PostGallery } from './PostGallery'
import styles from './postView.module.css'
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
  const {
    comments,
    draftComment,
    canPublishComment,
    isPublishingComment,
    commentChangeHandler,
    commentPublishHandler,
  } = usePostComments(post.id)

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

          <PostComments comments={comments} />
        </Scroll>

        <div className={styles.footer}>
          <div className={styles.engagement}>
            <PostEngagementStub />
            {/* Real data next to the stubs: the date must survive deleting `ui/stubs/`. */}
            {publishedAt ? <p className={styles.publishedAt}>{publishedAt}</p> : null}
          </div>

          <div className={styles.commentForm}>
            <PostCommentForm
              comment={draftComment}
              canPublish={canPublishComment}
              isPublishing={isPublishingComment}
              onCommentChange={commentChangeHandler}
              onPublish={commentPublishHandler}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

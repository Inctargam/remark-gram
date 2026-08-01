'use client'

import clsx from 'clsx'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { Icon } from '@/shared/ui/icon'
import { Scroll } from '@/shared/ui/scroll'

import { formatPostDate } from '../lib/formatPostDate'
import { formatPostRelativeTime } from '../lib/formatPostRelativeTime'
import { getPostImageAlt } from '../lib/getPostImageAlt'
import { getGalleryIndex, hasGalleryControls } from '../lib/postGallery'
import type { Post } from '../model/types'
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
  const [imageIndex, setImageIndex] = useState(0)

  const totalImages = post.images.length
  const currentImage = post.images[imageIndex] ?? post.images[0]
  const showGalleryControls = hasGalleryControls(totalImages)
  const isFirstImage = imageIndex === 0
  const isLastImage = imageIndex === totalImages - 1
  const publishedAt = formatPostDate(post.createdAt)
  const postedAgo = formatPostRelativeTime(post.createdAt)

  const previousImageHandler = () => {
    setImageIndex((current) => getGalleryIndex(current, totalImages, -1))
  }

  const nextImageHandler = () => {
    setImageIndex((current) => getGalleryIndex(current, totalImages, 1))
  }

  return (
    <div className={styles.post}>
      <div className={styles.gallery}>
        {currentImage ? (
          <Image
            className={styles.image}
            src={currentImage.url}
            alt={getPostImageAlt(post)}
            fill
            sizes="(max-width: 900px) 100vw, 490px"
            // Same reason as in PostThumbnail: mock images are data URLs and the future
            // host is not in remotePatterns yet.
            unoptimized
          />
        ) : (
          <div className={styles.emptyGallery} aria-hidden="true" />
        )}

        {showGalleryControls ? (
          <>
            {isFirstImage ? null : (
              <button
                className={clsx(styles.arrow, styles.arrowPrevious)}
                type="button"
                aria-label="Show previous photo"
                onClick={previousImageHandler}>
                <Icon iconId="icon-arrow-ios-back" width={24} height={24} />
              </button>
            )}

            {isLastImage ? null : (
              <button
                className={clsx(styles.arrow, styles.arrowNext)}
                type="button"
                aria-label="Show next photo"
                onClick={nextImageHandler}>
                <Icon iconId="icon-arrow-ios-forward" width={24} height={24} />
              </button>
            )}

            <div className={styles.dots} aria-label="Publication photos">
              {post.images.map((image, index) => (
                <button
                  className={styles.dot}
                  data-selected={index === imageIndex ? '' : undefined}
                  type="button"
                  key={image.url}
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={index === imageIndex}
                  onClick={() => setImageIndex(index)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className={styles.side}>
        <div className={styles.author}>
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

        <Scroll className={styles.content}>
          {post.description ? (
            <div className={styles.description}>
              <span className={styles.avatar} aria-hidden="true" />
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

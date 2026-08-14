'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { MouseEvent } from 'react'

import { formatPostRelativeTime, getPostImageAlt, type Post } from '@/entities/post'

import styles from './homePage.module.css'

type Props = {
  href: string
  post: Post
  onOpen: (event: MouseEvent<HTMLAnchorElement>, post: Post) => void
}

const DESCRIPTION_PREVIEW_LENGTH = 96

const getDescriptionPreview = (description: string) => {
  if (description.length <= DESCRIPTION_PREVIEW_LENGTH) {
    return description
  }

  return `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`
}

export const HomePostCard = ({ href, post, onOpen }: Props) => {
  const cover = post.images[0]
  const postedAgo = formatPostRelativeTime(post.createdAt)
  const descriptionPreview = getDescriptionPreview(post.description)

  return (
    <article className={styles.postCard}>
      <div className={styles.postImageSlot}>
        <Link className={styles.postImageLink} href={href} onClick={(event) => onOpen(event, post)}>
          {cover ? (
            <Image
              className={styles.postImage}
              src={cover.url}
              alt={getPostImageAlt(post)}
              fill
              sizes="(max-width: 767px) calc(50vw - 18px), 234px"
              unoptimized
            />
          ) : null}
        </Link>
      </div>

      <Link className={styles.postDetailsLink} href={href} onClick={(event) => onOpen(event, post)}>
        <div className={styles.postAuthor}>
          <span className={styles.postAvatar} aria-hidden="true">
            {post.ownerAvatarUrl ? (
              <Image
                className={styles.postAvatarImage}
                src={post.ownerAvatarUrl}
                alt=""
                fill
                sizes="36px"
                unoptimized
              />
            ) : null}
          </span>
          <span className={styles.postAuthorName}>{post.ownerUsername}</span>
        </div>

        {postedAgo ? <time className={styles.postTime}>{postedAgo}</time> : null}

        {post.description ? (
          <p className={styles.postDescription}>
            {descriptionPreview}
            {descriptionPreview !== post.description ? (
              <>
                {' '}
                <span className={styles.showMore}>Show more</span>
              </>
            ) : null}
          </p>
        ) : null}
      </Link>
    </article>
  )
}

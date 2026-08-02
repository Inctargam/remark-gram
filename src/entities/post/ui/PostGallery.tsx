'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'

import { Icon } from '@/shared/ui/icon'

import { getPostImageAlt } from '../lib/getPostImageAlt'
import { getGalleryIndex, hasGalleryControls } from '../lib/postGallery'
import type { Post } from '../model/types'
import styles from './postGallery.module.css'

type Props = {
  post: Post
  className?: string
}

/**
 * Photo column of a post: the same gallery is shown when viewing a post and when editing it,
 * so the arrows, dots and the current-photo state live here and not in either screen.
 */
export const PostGallery = ({ post, className }: Props) => {
  const [imageIndex, setImageIndex] = useState(0)

  const totalImages = post.images.length
  const currentImage = post.images[imageIndex] ?? post.images[0]
  const showGalleryControls = hasGalleryControls(totalImages)
  const isFirstImage = imageIndex === 0
  const isLastImage = imageIndex === totalImages - 1

  const previousImageHandler = () => {
    setImageIndex((current) => getGalleryIndex(current, totalImages, -1))
  }

  const nextImageHandler = () => {
    setImageIndex((current) => getGalleryIndex(current, totalImages, 1))
  }

  return (
    <div className={clsx(styles.gallery, className)}>
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
  )
}

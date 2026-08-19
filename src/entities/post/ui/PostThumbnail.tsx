import Image from 'next/image'

import { getPostImageAlt } from '../lib/getPostImageAlt'
import type { Post } from '../model/types'
import styles from './postThumbnail.module.css'

type Props = {
  post: Post
}

export const PostThumbnail = ({ post }: Props) => {
  const cover = post.images[0]

  if (!cover) {
    return <div className={styles.thumbnail} aria-hidden="true" />
  }

  return (
    <div className={styles.thumbnail}>
      <Image
        className={styles.image}
        src={cover.url}
        alt={getPostImageAlt(post)}
        fill
        sizes="(max-width: 767px) 33vw, (max-width: 1023px) 33vw, 234px"
        // Mock images are data URLs and future ones come from an external host,
        // so the optimizer is skipped until remotePatterns are configured.
        unoptimized
      />
    </div>
  )
}

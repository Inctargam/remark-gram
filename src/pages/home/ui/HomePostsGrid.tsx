'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'

import type { Post } from '@/entities/post'
import { PostThumbnail, PostViewModal } from '@/entities/post'
import { ROUTES } from '@/shared/config'
import { buildProfilePostUrl } from '@/widgets/profile-posts'

import { useHomePostModal } from '../model/useHomePostModal'
import styles from './homePage.module.css'

type Props = {
  posts: Post[]
}

export const HomePostsGrid = ({ posts }: Props) => {
  const { modalOpenChangeHandler, postOpenHandler, selectedPost } = useHomePostModal({ posts })

  const postClickHandler = (event: MouseEvent<HTMLAnchorElement>, post: Post) => {
    event.preventDefault()
    postOpenHandler(post)
  }

  return (
    <>
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <Link
            className={styles.postLink}
            href={buildProfilePostUrl({
              userId: post.ownerId,
              postId: post.id,
              returnTo: ROUTES.home,
            })}
            key={post.id}
            onClick={(event) => postClickHandler(event, post)}>
            <PostThumbnail post={post} />
          </Link>
        ))}
      </div>

      <PostViewModal
        post={selectedPost}
        open={selectedPost !== null}
        onOpenChange={modalOpenChangeHandler}
      />
    </>
  )
}

'use client'

import type { MouseEvent } from 'react'

import type { Post } from '@/entities/post'
import { PostViewModal } from '@/entities/post'
import { useSessionStatus } from '@/shared/auth'
import { ROUTES } from '@/shared/config'
import { buildProfilePostUrl } from '@/widgets/profile-posts'

import { useHomePostModal } from '../model/useHomePostModal'
import styles from './homePage.module.css'
import { HomePostCard } from './HomePostCard'

type Props = {
  posts: Post[]
}

export const HomePostsGrid = ({ posts }: Props) => {
  const sessionStatus = useSessionStatus()
  const { modalOpenChangeHandler, postOpenHandler, selectedPost } = useHomePostModal({ posts })
  const canInteractWithPost = sessionStatus === 'authenticated'

  const postClickHandler = (event: MouseEvent<HTMLAnchorElement>, post: Post) => {
    event.preventDefault()
    postOpenHandler(post)
  }

  return (
    <>
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <HomePostCard
            href={buildProfilePostUrl({
              userId: post.ownerId,
              postId: post.id,
              returnTo: ROUTES.home,
            })}
            key={post.id}
            post={post}
            onOpen={postClickHandler}
          />
        ))}
      </div>

      <PostViewModal
        post={selectedPost}
        open={selectedPost !== null}
        onOpenChange={modalOpenChangeHandler}
        canInteract={canInteractWithPost}
      />
    </>
  )
}

'use client'

import type { Post } from '@/entities/post'
import { PostActionsMenu } from '@/features/post-actions'
import { useCurrentUser, useSessionStatus } from '@/shared/auth'

import styles from './profilePostsGrid.module.css'

type Props = {
  onDelete: () => void
  onEdit: () => void
  post: Post
}

export const ProfilePostOwnerActions = ({ onDelete, onEdit, post }: Props) => {
  const status = useSessionStatus()
  const currentUser = useCurrentUser()

  if (status === 'loading') {
    return <span className={styles.actionsSkeleton} aria-label="Loading post actions" />
  }

  const canManagePost = status === 'authenticated' && currentUser?.id === post.ownerId

  if (!canManagePost) {
    return null
  }

  return <PostActionsMenu onEdit={onEdit} onDelete={onDelete} />
}

'use client'

import { useCallback } from 'react'

import { useProfilePostsQuery } from '@/entities/post'

import { ProfilePostsGridView } from './ProfilePostsGridView'

type Props = {
  userId: string
}

const LOAD_ERROR_MESSAGE = 'Failed to load publications. Please try again.'

export const ProfilePostsGrid = ({ userId }: Props) => {
  const { posts, error, hasNextPage, isFetchingNextPage, isPending, fetchNextPage } =
    useProfilePostsQuery(userId)

  const loadMoreHandler = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])

  return (
    <ProfilePostsGridView
      posts={posts}
      errorMessage={error ? LOAD_ERROR_MESSAGE : null}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isPending}
      onLoadMore={loadMoreHandler}
    />
  )
}

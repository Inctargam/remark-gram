'use client'

import { useEffect, useRef } from 'react'

import { shouldFetchNextPage } from './shouldFetchNextPage'

type UseInfiniteScrollParams = {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
}

/** Starts loading before the sentinel is actually on screen, so the grid rarely shows a gap. */
const SENTINEL_ROOT_MARGIN = '200px'

/**
 * Watches a sentinel element placed after the last tile and asks for the next page
 * once it comes into view. Returns the ref to attach to that sentinel.
 */
export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: UseInfiniteScrollParams) => {
  const sentinelRef = useRef<HTMLDivElement>(null)
  // The callback identity changes on every render; keeping it in a ref avoids
  // tearing down and recreating the observer on each one.
  const loadMoreRef = useRef(onLoadMore)

  useEffect(() => {
    loadMoreRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return
        }

        if (
          shouldFetchNextPage({
            isSentinelVisible: entry.isIntersecting,
            hasNextPage,
            isFetchingNextPage,
          })
        ) {
          loadMoreRef.current()
        }
      },
      { rootMargin: SENTINEL_ROOT_MARGIN }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, isFetchingNextPage])

  return sentinelRef
}

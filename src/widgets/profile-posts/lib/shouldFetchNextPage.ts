type ShouldFetchNextPageParams = {
  /** The sentinel below the last tile entered the viewport. */
  isSentinelVisible: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

/**
 * Pure decision behind the infinite scroll, kept out of the hook so it is covered by unit tests
 * (the unit project runs in `node` and cannot mount an IntersectionObserver).
 */
export const shouldFetchNextPage = ({
  isSentinelVisible,
  hasNextPage,
  isFetchingNextPage,
}: ShouldFetchNextPageParams): boolean => isSentinelVisible && hasNextPage && !isFetchingNextPage

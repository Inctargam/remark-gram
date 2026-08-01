import { describe, expect, it } from 'vitest'

import { shouldFetchNextPage } from './shouldFetchNextPage'

const visibleWithNextPage = {
  isSentinelVisible: true,
  hasNextPage: true,
  isFetchingNextPage: false,
}

describe('should fetch next page', () => {
  it('fetches when the sentinel is visible and a next page exists', () => {
    expect(shouldFetchNextPage(visibleWithNextPage)).toBe(true)
  })

  it('does not fetch while the sentinel is out of view', () => {
    expect(shouldFetchNextPage({ ...visibleWithNextPage, isSentinelVisible: false })).toBe(false)
  })

  it('does not fetch on the last page', () => {
    expect(shouldFetchNextPage({ ...visibleWithNextPage, hasNextPage: false })).toBe(false)
  })

  it('does not fetch twice while a page is already loading', () => {
    expect(shouldFetchNextPage({ ...visibleWithNextPage, isFetchingNextPage: true })).toBe(false)
  })
})

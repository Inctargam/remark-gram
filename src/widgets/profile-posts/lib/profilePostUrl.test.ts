import { describe, expect, it } from 'vitest'

import { buildProfilePostUrl } from './profilePostUrl'

describe('buildProfilePostUrl', () => {
  it('adds selected post id to profile URL', () => {
    expect(
      buildProfilePostUrl({
        searchParams: new URLSearchParams(),
        userId: 'mock-user-1',
        postId: 'post-1',
      })
    ).toBe('/profile/mock-user-1?postId=post-1')
  })

  it('preserves unrelated search params when selecting a post', () => {
    expect(
      buildProfilePostUrl({
        searchParams: new URLSearchParams('returnTo=%2F'),
        userId: 'mock-user-1',
        postId: 'post-2',
      })
    ).toBe('/profile/mock-user-1?returnTo=%2F&postId=post-2')
  })

  it('removes selected post id when closing a post', () => {
    expect(
      buildProfilePostUrl({
        searchParams: new URLSearchParams('postId=post-1&returnTo=%2F'),
        userId: 'mock-user-1',
      })
    ).toBe('/profile/mock-user-1?returnTo=%2F')
  })
})

import { describe, expect, it } from 'vitest'

import { buildPostModalCloseUrl, buildProfilePostUrl } from './profilePostUrl'

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

  it('adds safe home return URL when opening a post from home', () => {
    expect(
      buildProfilePostUrl({
        userId: 'mock-user-1',
        postId: 'post-3',
        returnTo: '/',
      })
    ).toBe('/profile/mock-user-1?postId=post-3&returnTo=%2F')
  })

  it('ignores unsafe return URLs when opening a post', () => {
    expect(
      buildProfilePostUrl({
        searchParams: new URLSearchParams('returnTo=%2F'),
        userId: 'mock-user-1',
        postId: 'post-4',
        returnTo: 'https://example.com',
      })
    ).toBe('/profile/mock-user-1?postId=post-4')
  })
})

describe('buildPostModalCloseUrl', () => {
  it('removes selected post id when closing a profile post', () => {
    expect(
      buildPostModalCloseUrl({
        searchParams: new URLSearchParams('postId=post-1&part=feed'),
        userId: 'mock-user-1',
      })
    ).toBe('/profile/mock-user-1?part=feed')
  })

  it('returns home when a post was opened from home', () => {
    expect(
      buildPostModalCloseUrl({
        searchParams: new URLSearchParams('postId=post-1&returnTo=%2F'),
        userId: 'mock-user-1',
      })
    ).toBe('/')
  })

  it('ignores unsafe return URLs when closing a post', () => {
    expect(
      buildPostModalCloseUrl({
        searchParams: new URLSearchParams('postId=post-1&returnTo=https%3A%2F%2Fexample.com'),
        userId: 'mock-user-1',
      })
    ).toBe('/profile/mock-user-1')
  })
})

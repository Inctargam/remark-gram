import { beforeEach, describe, expect, it } from 'vitest'

import { resetPostsMockStore } from '@/shared/api/mock/postsStore'
import { MOCK_CURRENT_USER_ID } from '@/shared/auth'

import { getPostServer, getProfilePostsServer } from './postsApi.server'

beforeEach(() => {
  resetPostsMockStore()
})

describe('getProfilePostsServer', () => {
  it('reads the first profile posts page directly from the mock store', () => {
    const page = getProfilePostsServer({ userId: MOCK_CURRENT_USER_ID })

    expect(page?.items).toHaveLength(8)
    expect(page?.items.every((post) => post.ownerId === MOCK_CURRENT_USER_ID)).toBe(true)
    expect(page?.nextCursor).toBe('mock-user-1-post-09')
  })

  it('returns null for an invalid cursor', () => {
    expect(getProfilePostsServer({ userId: MOCK_CURRENT_USER_ID, cursor: 'missing' })).toBeNull()
  })
})

describe('getPostServer', () => {
  it('reads a post directly from the mock store', () => {
    expect(getPostServer('mock-user-1-post-01')).toMatchObject({
      id: 'mock-user-1-post-01',
      ownerId: MOCK_CURRENT_USER_ID,
    })
  })

  it('returns null for an unknown post', () => {
    expect(getPostServer('missing-post')).toBeNull()
  })
})

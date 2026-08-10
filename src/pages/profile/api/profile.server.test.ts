import { beforeEach, describe, expect, it } from 'vitest'

import {
  createPost,
  deletePost,
  MOCK_OTHER_USER_ID,
  resetPostsMockStore,
} from '@/shared/api/mock/postsStore'
import { MOCK_CURRENT_USER_ID } from '@/shared/auth'

import { getPublicProfile } from './publicProfile.server'

beforeEach(() => {
  resetPostsMockStore()
})

describe('getPublicProfile', () => {
  it('returns public data for the current mock user', () => {
    expect(getPublicProfile(MOCK_CURRENT_USER_ID)).toMatchObject({
      id: MOCK_CURRENT_USER_ID,
      username: 'UserName',
      followingCount: 2218,
      followersCount: 2358,
      publicationsCount: 20,
      avatarUrl: null,
    })
  })

  it('returns public data for another mock user', () => {
    expect(getPublicProfile(MOCK_OTHER_USER_ID)).toMatchObject({
      id: MOCK_OTHER_USER_ID,
      username: 'OtherUser',
      publicationsCount: 4,
    })
  })

  it('returns null for an unknown user', () => {
    expect(getPublicProfile('missing-user')).toBeNull()
  })

  it('derives publication count from the posts store', () => {
    const createdPost = createPost({
      description: 'Fresh publication',
      images: [{ url: 'data:image/svg+xml;utf8,<svg/>', width: 1080, height: 1080 }],
    })

    expect(getPublicProfile(MOCK_CURRENT_USER_ID)?.publicationsCount).toBe(21)

    deletePost(createdPost.id)

    expect(getPublicProfile(MOCK_CURRENT_USER_ID)?.publicationsCount).toBe(20)
  })
})

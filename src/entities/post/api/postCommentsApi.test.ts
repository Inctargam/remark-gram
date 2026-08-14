import { beforeEach, describe, expect, it } from 'vitest'

import { getPostComments, publishPostComment, resetPostCommentsMockStore } from './postCommentsApi'

describe('postCommentsApi mock store', () => {
  beforeEach(() => {
    resetPostCommentsMockStore()
  })

  it('returns seeded comments for a post', () => {
    expect(getPostComments('post-1')).toHaveLength(2)
  })

  it('persists published comments for the same post', async () => {
    await publishPostComment({ postId: 'post-1', text: 'Persistent comment' })

    expect(getPostComments('post-1')[0]).toEqual({
      id: 'post-1-comment-published-1',
      author: 'UserName',
      text: 'Persistent comment',
      createdAtLabel: 'Just now',
    })
  })

  it('keeps seeded comments isolated by post', () => {
    expect(getPostComments('post-1')[0]?.id).toBe('post-1-comment-1')
    expect(getPostComments('post-2')[0]?.id).toBe('post-2-comment-1')
  })
})

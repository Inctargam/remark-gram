import { describe, expect, it } from 'vitest'

import {
  createMockPostComments,
  createPublishedPostComment,
  getPublishablePostComment,
  normalizePostComment,
  POST_COMMENT_MAX_LENGTH,
} from './postComments'

const createComment = (length: number) => 'a'.repeat(length)

describe('postComments', () => {
  it('creates deterministic mock comments for a post', () => {
    expect(createMockPostComments('post-1')).toEqual([
      {
        id: 'post-1-comment-1',
        author: 'URLProfiles',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        createdAtLabel: '2 Hours ago',
        replies: [
          {
            id: 'post-1-comment-1-reply-1',
            author: 'URLProfiles',
            text: 'Reply mock text for a threaded comment.',
            createdAtLabel: '2 Hours ago',
          },
        ],
      },
      {
        id: 'post-1-comment-2',
        author: 'URLProfiles',
        text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        createdAtLabel: '2 Hours ago',
      },
    ])
  })

  it('normalizes comments to the supported mock length', () => {
    expect(normalizePostComment(createComment(POST_COMMENT_MAX_LENGTH + 1))).toHaveLength(
      POST_COMMENT_MAX_LENGTH
    )
  })

  it('returns null for blank comments before publishing', () => {
    expect(getPublishablePostComment('   ')).toBeNull()
  })

  it('trims publishable comments', () => {
    expect(getPublishablePostComment('  mock comment  ')).toBe('mock comment')
  })

  it('creates a published mock comment', () => {
    expect(createPublishedPostComment({ id: 'comment-1', text: 'Published comment' })).toEqual({
      id: 'comment-1',
      author: 'UserName',
      text: 'Published comment',
      createdAtLabel: 'Just now',
    })
  })
})

export const POST_COMMENT_MAX_LENGTH = 500

export type PostComment = {
  author: string
  createdAtLabel: string
  id: string
  text: string
}

const MOCK_COMMENT_AUTHOR = 'URLProfiles'
const MOCK_PUBLISHED_COMMENT_AUTHOR = 'UserName'

export const normalizePostComment = (comment: string) => comment.slice(0, POST_COMMENT_MAX_LENGTH)

export const getPublishablePostComment = (comment: string) => {
  const normalizedComment = normalizePostComment(comment).trim()

  return normalizedComment.length > 0 ? normalizedComment : null
}

export const createMockPostComments = (postId: string): PostComment[] => [
  {
    id: `${postId}-comment-1`,
    author: MOCK_COMMENT_AUTHOR,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAtLabel: '2 Hours ago',
  },
  {
    id: `${postId}-comment-2`,
    author: MOCK_COMMENT_AUTHOR,
    text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAtLabel: '2 Hours ago',
  },
]

type CreatePublishedCommentParams = {
  id: string
  text: string
}

export const createPublishedPostComment = ({
  id,
  text,
}: CreatePublishedCommentParams): PostComment => ({
  id,
  author: MOCK_PUBLISHED_COMMENT_AUTHOR,
  text,
  createdAtLabel: 'Just now',
})

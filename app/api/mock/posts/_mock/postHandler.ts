import { isValidPostDescription, POST_DESCRIPTION_MAX_LENGTH } from '@/entities/post'

import { deletePost, findPost, updatePostDescription } from './postsStore'

const postNotFound = () => Response.json({ message: 'Post not found.' }, { status: 404 })

export const getPostHandler = async (postId: string) => {
  const post = findPost(postId)

  return post ? Response.json(post) : postNotFound()
}

type UpdatePostRequestBody = {
  description?: unknown
}

/** Only the description is editable — UC-2 changes nothing else. */
export const updatePostHandler = async (request: Request, postId: string) => {
  const body: UpdatePostRequestBody | null = await request.json().catch(() => null)
  const description = body?.description

  if (typeof description !== 'string' || !isValidPostDescription(description)) {
    return Response.json(
      { message: `description must be a string up to ${POST_DESCRIPTION_MAX_LENGTH} characters.` },
      { status: 400 }
    )
  }

  const post = updatePostDescription(postId, description)

  return post ? Response.json(post) : postNotFound()
}

export const deletePostHandler = async (postId: string) => {
  const isDeleted = deletePost(postId)

  return isDeleted ? new Response(null, { status: 204 }) : postNotFound()
}

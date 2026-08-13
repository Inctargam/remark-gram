import type { PostComment } from '../model/postComments'
import { createMockPostComments, createPublishedPostComment } from '../model/postComments'

const STORE_KEY = '__inctagramPostCommentsMockStore'

type PostCommentsStoreState = {
  commentsByPostId: Record<string, PostComment[]>
  nextCommentIndex: number
}

type GlobalWithPostCommentsStore = typeof globalThis & {
  [STORE_KEY]?: PostCommentsStoreState
}

const getState = (): PostCommentsStoreState => {
  const globalWithStore = globalThis as GlobalWithPostCommentsStore

  globalWithStore[STORE_KEY] ??= {
    commentsByPostId: {},
    nextCommentIndex: 1,
  }

  return globalWithStore[STORE_KEY]
}

const getPostCommentsState = (postId: string) => {
  const state = getState()

  state.commentsByPostId[postId] ??= createMockPostComments(postId)

  return state.commentsByPostId[postId]
}

export const getPostComments = (postId: string): PostComment[] => [...getPostCommentsState(postId)]

type PublishPostCommentPayload = {
  postId: string
  text: string
}

export const publishPostComment = async ({
  postId,
  text,
}: PublishPostCommentPayload): Promise<PostComment> => {
  const state = getState()
  const comment = createPublishedPostComment({
    id: `${postId}-comment-published-${state.nextCommentIndex}`,
    text,
  })

  state.nextCommentIndex += 1
  getPostCommentsState(postId).unshift(comment)

  return comment
}

export const resetPostCommentsMockStore = () => {
  ;(globalThis as GlobalWithPostCommentsStore)[STORE_KEY] = {
    commentsByPostId: {},
    nextCommentIndex: 1,
  }
}

import { withMockDelay } from '../_mock/mockDelay'
import { createPostHandler, getPostsListHandler } from './_mock/postsListHandler'

export const GET = withMockDelay(getPostsListHandler)
export const POST = withMockDelay(createPostHandler)

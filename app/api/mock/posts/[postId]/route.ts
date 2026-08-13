import { withMockDelay } from '../../_mock/mockDelay'
import { deletePostHandler, getPostHandler, updatePostHandler } from '../_mock/postHandler'

type PostRouteContext = {
  params: Promise<{ postId: string }>
}

export const GET = withMockDelay(async (_request: Request, { params }: PostRouteContext) => {
  const { postId } = await params

  return getPostHandler(postId)
})

export const PATCH = withMockDelay(async (request: Request, { params }: PostRouteContext) => {
  const { postId } = await params

  return updatePostHandler(request, postId)
})

export const DELETE = withMockDelay(async (_request: Request, { params }: PostRouteContext) => {
  const { postId } = await params

  return deletePostHandler(postId)
})

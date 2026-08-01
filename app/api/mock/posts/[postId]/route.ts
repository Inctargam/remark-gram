import { deletePostHandler, getPostHandler, updatePostHandler } from '../_mock/postHandler'

type PostRouteContext = {
  params: Promise<{ postId: string }>
}

export const GET = async (_request: Request, { params }: PostRouteContext) => {
  const { postId } = await params

  return getPostHandler(postId)
}

export const PATCH = async (request: Request, { params }: PostRouteContext) => {
  const { postId } = await params

  return updatePostHandler(request, postId)
}

export const DELETE = async (_request: Request, { params }: PostRouteContext) => {
  const { postId } = await params

  return deletePostHandler(postId)
}

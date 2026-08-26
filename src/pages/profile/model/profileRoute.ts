const BACKEND_ID_PATTERN = /^[1-9]\d*$/

export const isBackendProfileUserId = (userId: string) => BACKEND_ID_PATTERN.test(userId)

export const isBackendPostId = (postId: string) => BACKEND_ID_PATTERN.test(postId)

export const shouldDeferProfilePostLookupToClient = ({
  isMockPostsApi,
  postId,
  userId,
}: {
  isMockPostsApi: boolean
  postId: string
  userId: string
}) => !isMockPostsApi && isBackendProfileUserId(userId) && isBackendPostId(postId)

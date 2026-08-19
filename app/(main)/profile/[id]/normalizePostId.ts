export const normalizePostId = (postId: string | string[] | undefined): string | null => {
  if (Array.isArray(postId)) {
    return postId[0] ?? null
  }

  return postId ?? null
}

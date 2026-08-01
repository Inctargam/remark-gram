/**
 * Single key factory for every posts query.
 * Mutations in `features/edit-post` and `features/delete-post` invalidate through it,
 * so a key never has to be spelled out twice.
 */
export const postsQueryKeys = {
  all: ['posts'] as const,
  lists: () => [...postsQueryKeys.all, 'list'] as const,
  list: (userId: string) => [...postsQueryKeys.lists(), userId] as const,
  details: () => [...postsQueryKeys.all, 'detail'] as const,
  detail: (postId: string) => [...postsQueryKeys.details(), postId] as const,
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postsQueryKeys } from '@/entities/post'

import { publishPostMock, type PublishPostPayload } from './publishPostMock'

export const usePublishPostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { globalErrorHandler: 'off' },
    mutationFn: (payload: PublishPostPayload) => publishPostMock(payload),
    // The published post belongs on top of the profile grid, whose pages are already cached.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postsQueryKeys.lists() }),
  })
}

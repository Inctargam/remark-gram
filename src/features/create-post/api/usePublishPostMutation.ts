import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postsQueryKeys } from '@/entities/post'

import { publishPostApi } from './publishPostApi'
import type { PublishPostVariables } from './publishPostTypes'

export const usePublishPostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ payload, signal }: PublishPostVariables) => publishPostApi(payload, signal),
    // The published post belongs on top of the profile grid, whose pages are already cached.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postsQueryKeys.lists() }),
  })
}

import { useMutation } from '@tanstack/react-query'

import { publishPostMock, type PublishPostPayload } from './publishPostMock'

export const usePublishPostMutation = () =>
  useMutation({
    mutationFn: (payload: PublishPostPayload) => publishPostMock(payload),
  })

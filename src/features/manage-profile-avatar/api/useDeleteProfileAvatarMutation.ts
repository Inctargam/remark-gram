import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteProfileAvatar } from './profileAvatarApi'
import { updateProfileAvatarCache } from './updateProfileAvatarCache'

export const useDeleteProfileAvatarMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProfileAvatar,
    onSuccess: (response) => updateProfileAvatarCache(queryClient, response),
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { uploadProfileAvatar } from './profileAvatarApi'
import { updateProfileAvatarCache } from './updateProfileAvatarCache'

export const useUploadProfileAvatarMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadProfileAvatar,
    onSuccess: (response) => updateProfileAvatarCache(queryClient, response),
  })
}

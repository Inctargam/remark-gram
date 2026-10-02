import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { AvatarChangeOperation } from '../model/avatarUploadOperation'
import { deleteProfileAvatar } from './profileAvatarApi'
import { changeProfileAvatar } from './updateProfileAvatarCache'
export const useDeleteProfileAvatarMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (operation: AvatarChangeOperation) =>
      changeProfileAvatar(queryClient, operation, null, deleteProfileAvatar),
    retry: false,
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type AvatarUploadOperation, prepareAvatarUpload } from '../model/avatarUploadOperation'
import { setProfileAvatar } from './profileAvatarApi'
import { changeProfileAvatar } from './updateProfileAvatarCache'
export const useUploadProfileAvatarMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (operation: AvatarUploadOperation) => {
      const fileId = await prepareAvatarUpload(operation)
      await changeProfileAvatar(queryClient, operation, fileId, (key) => setProfileAvatar(fileId, key))
    },
    retry: false,
  })
}

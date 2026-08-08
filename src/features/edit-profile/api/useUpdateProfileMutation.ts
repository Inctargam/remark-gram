import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ProfileDto } from '../model/editProfileTypes'
import { updateProfile } from './editProfileApi'
import { profileQueryKeys } from './profileQueryKeys'

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile: ProfileDto) => {
      queryClient.setQueryData(profileQueryKeys.current(), profile)
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateProfile } from './editProfileApi'
import { profileQueryKeys } from './profileQueryKeys'

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKeys.current(), profile)
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { profileQueryKeys } from '@/entities/profile'

import { updateProfile } from './editProfileApi'

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKeys.current(), profile)
    },
  })
}

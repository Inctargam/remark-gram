import { useMutation } from '@tanstack/react-query'

import { updateProfile } from './editProfileApi'

export const useUpdateProfileMutation = () => {
  return useMutation({ mutationFn: updateProfile })
}

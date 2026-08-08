import { useQuery } from '@tanstack/react-query'

import { getProfile } from './editProfileApi'
import { profileQueryKeys } from './profileQueryKeys'

export const useProfileQuery = () =>
  useQuery({
    queryKey: profileQueryKeys.current(),
    queryFn: getProfile,
  })

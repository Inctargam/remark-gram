import { useQuery } from '@tanstack/react-query'

import { getProfile } from './profileApi'
import { profileQueryKeys } from './profileQueryKeys'

export const useProfileQuery = (enabled = true) =>
  useQuery({
    enabled,
    queryKey: profileQueryKeys.current(),
    queryFn: getProfile,
    staleTime: 60_000,
  })

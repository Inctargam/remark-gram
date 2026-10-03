import { useQuery } from '@tanstack/react-query'

import { profileQueryKeys } from './profileQueryKeys'
import { getPublicProfile } from './publicProfileApi'

export const usePublicProfileQuery = (userId: string, enabled = true) =>
  useQuery({
    enabled,
    queryKey: profileQueryKeys.public(userId),
    queryFn: () => getPublicProfile(userId),
    staleTime: 60_000,
  })

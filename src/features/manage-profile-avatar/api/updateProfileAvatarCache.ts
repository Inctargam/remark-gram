import type { QueryClient } from '@tanstack/react-query'

import { getProfile, type Profile, profileQueryKeys } from '@/entities/profile'

import type { AvatarChangeOperation } from '../model/avatarUploadOperation'
import { ProfileAvatarRequestError } from './profileAvatarApi'

const updateAvatar = (queryClient: QueryClient, avatarFileId: string | null) => {
  queryClient.setQueryData<Profile>(profileQueryKeys.current(), (profile) =>
    profile ? { ...profile, avatarFileId } : profile
  )
}
const refreshProfile = async (queryClient: QueryClient) => {
  await queryClient.cancelQueries({ queryKey: profileQueryKeys.current(), exact: true })
  return queryClient.fetchQuery({
    queryKey: profileQueryKeys.current(),
    queryFn: getProfile,
    staleTime: 0,
    retry: false,
  })
}

export const changeProfileAvatar = async (
  queryClient: QueryClient,
  operation: AvatarChangeOperation,
  avatarFileId: string | null,
  request: (key: string) => Promise<void>
) => {
  await queryClient.cancelQueries({ queryKey: profileQueryKeys.current() })
  if (operation.applied || operation.reconciliationRequired) {
    const profile = await refreshProfile(queryClient)
    operation.reconciliationRequired = false
    if (profile.avatarFileId === avatarFileId) {
      operation.applied = true
      return
    }
    if (operation.applied) {
      return
    }
  }
  if (operation.retryWithNewKey) {
    // The backend stores a final 503; renew the key only after checking the profile.
    operation.idempotencyKey = crypto.randomUUID()
    operation.retryWithNewKey = false
  }
  try {
    await request(operation.idempotencyKey)
    operation.applied = true
    updateAvatar(queryClient, avatarFileId)
  } catch (error) {
    const isUncertain = !(error instanceof ProfileAvatarRequestError) || error.status >= 500
    if (!isUncertain) {
      throw error
    }
    operation.reconciliationRequired = true
    operation.retryWithNewKey =
      avatarFileId !== null && error instanceof ProfileAvatarRequestError && error.status === 503
    try {
      const profile = await refreshProfile(queryClient)
      operation.reconciliationRequired = false
      if (profile.avatarFileId === avatarFileId) {
        operation.applied = true
        return
      }
    } catch {
      throw new Error(
        'Could not confirm the avatar change. Please try again to check your profile.'
      )
    }
    throw error
  }
  try {
    await refreshProfile(queryClient)
  } catch {
    throw new Error(
      'The photo change was saved, but the profile could not be refreshed. Please try again.'
    )
  }
}

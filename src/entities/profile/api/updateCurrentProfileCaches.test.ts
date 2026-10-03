import { QueryClient, QueryObserver } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { sessionStore } from '@/shared/auth'

import type { Profile } from '../model/profileTypes'
import { profileQueryKeys } from './profileQueryKeys'
import { updateCurrentProfileCaches } from './updateCurrentProfileCaches'

const PROFILE: Profile = {
  id: 42,
  userName: 'newName',
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  country: '',
  countryCode: null,
  city: '',
  aboutMe: 'Updated bio',
  avatarFileId: 'new-avatar',
}

afterEach(() => sessionStore.getState().setGuest())

describe('profile cache and session synchronization', () => {
  it('updates the current identity and invalidates only its public cache', () => {
    const queryClient = new QueryClient()
    sessionStore.getState().setAuthenticated('token', {
      id: '42',
      username: 'oldName',
      email: 'user@example.com',
      avatarUrl: null,
    })
    queryClient.setQueryData(profileQueryKeys.public('42'), { userName: 'oldName' })
    queryClient.setQueryData(profileQueryKeys.public('99'), { userName: 'otherUser' })

    updateCurrentProfileCaches(queryClient, PROFILE)

    expect(queryClient.getQueryData(profileQueryKeys.current())).toEqual(PROFILE)
    expect(sessionStore.getState().currentUser).toMatchObject({
      username: 'newName',
      email: 'user@example.com',
      avatarUrl: expect.stringContaining('/files/images/new-avatar'),
    })
    expect(queryClient.getQueryState(profileQueryKeys.public('42'))?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(profileQueryKeys.public('99'))?.isInvalidated).toBe(false)

    updateCurrentProfileCaches(queryClient, { ...PROFILE, avatarFileId: null })
    expect(sessionStore.getState().currentUser?.avatarUrl).toBeNull()
  })

  it('preserves another account session and cached profile after a previous user response', () => {
    const queryClient = new QueryClient()
    const currentUser = {
      id: '99',
      username: 'otherUser',
      email: 'other@example.com',
      avatarUrl: null,
    }
    sessionStore.getState().setAuthenticated('other-token', currentUser)
    const currentProfile: Profile = { ...PROFILE, id: 99, userName: 'otherUser' }
    queryClient.setQueryData(profileQueryKeys.current(), currentProfile)

    updateCurrentProfileCaches(queryClient, PROFILE)

    expect(sessionStore.getState().currentUser).toEqual(currentUser)
    expect(sessionStore.getState().accessToken).toBe('other-token')
    expect(queryClient.getQueryData(profileQueryKeys.current())).toEqual(currentProfile)
  })

  it('does not cache a profile before the current identity is known', () => {
    const queryClient = new QueryClient()
    sessionStore.getState().setAuthenticated('token')

    updateCurrentProfileCaches(queryClient, PROFILE)

    expect(queryClient.getQueryData(profileQueryKeys.current())).toBeUndefined()
    expect(sessionStore.getState().currentUser).toBeNull()
  })

  it('does not restore a cleared profile from a refetch cancelled by logout', async () => {
    const queryClient = new QueryClient()
    sessionStore.getState().setAuthenticated('token', {
      id: '42',
      username: 'oldName',
      email: 'user@example.com',
      avatarUrl: null,
    })
    queryClient.setQueryData(profileQueryKeys.current(), PROFILE)

    let resolveProfile!: (profile: Profile) => void
    const pendingProfile = new Promise<Profile>((resolve) => {
      resolveProfile = resolve
    })
    const observer = new QueryObserver(queryClient, {
      queryKey: profileQueryKeys.current(),
      queryFn: () => pendingProfile,
      enabled: false,
      retry: false,
    })
    const unsubscribe = observer.subscribe(() => {})

    try {
      const refetchPromise = observer.refetch()
      sessionStore.getState().setGuest()
      queryClient.clear()

      const result = await refetchPromise
      expect(result.isError).toBe(false)
      expect(result.data).toEqual(PROFILE)

      if (result.data && !result.isError) {
        updateCurrentProfileCaches(queryClient, result.data)
      }

      expect(queryClient.getQueryData(profileQueryKeys.current())).toBeUndefined()
      expect(sessionStore.getState().status).toBe('guest')

      sessionStore.getState().setAuthenticated('other-token', {
        id: '99',
        username: 'otherUser',
        email: 'other@example.com',
        avatarUrl: null,
      })
      const nextProfile: Profile = { ...PROFILE, id: 99, userName: 'otherUser' }
      const loadNextProfile = vi.fn().mockResolvedValue(nextProfile)

      await expect(
        queryClient.fetchQuery({
          queryKey: profileQueryKeys.current(),
          queryFn: loadNextProfile,
          staleTime: 60_000,
        })
      ).resolves.toEqual(nextProfile)
      expect(loadNextProfile).toHaveBeenCalledOnce()

      resolveProfile(PROFILE)
      await pendingProfile
      expect(queryClient.getQueryData(profileQueryKeys.current())).toEqual(nextProfile)
    } finally {
      resolveProfile(PROFILE)
      unsubscribe()
      queryClient.clear()
    }
  })
})

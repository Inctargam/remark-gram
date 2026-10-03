import { QueryClient } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getProfile, type Profile, profileQueryKeys } from '@/entities/profile'
import { sessionStore } from '@/shared/auth'

import { createAvatarChangeOperation } from '../model/avatarUploadOperation'
import { ProfileAvatarRequestError } from './profileAvatarApi'
import { changeProfileAvatar } from './updateProfileAvatarCache'
vi.mock('@/entities/profile', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/profile')>()),
  getProfile: vi.fn(),
}))
const PROFILE: Profile = {
  id: 1,
  userName: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: null,
  country: '',
  countryCode: null,
  city: '',
  aboutMe: '',
  avatarFileId: 'old',
}
let queryClient: QueryClient
const avatarId = () => queryClient.getQueryData<Profile>(profileQueryKeys.current())?.avatarFileId
beforeEach(() => {
  vi.resetAllMocks()
  sessionStore.getState().setAuthenticated('token', {
    id: String(PROFILE.id),
    username: PROFILE.userName,
    email: 'user@example.com',
    avatarUrl: null,
  })
  queryClient = new QueryClient()
  queryClient.setQueryData(profileQueryKeys.current(), PROFILE)
  vi.mocked(getProfile).mockResolvedValue(PROFILE)
})
afterEach(() => {
  queryClient.clear()
  sessionStore.getState().setGuest()
})
describe('confirmed avatar changes and reconciliation', () => {
  it.each([
    { avatarFileId: 'new', uncertain: false },
    { avatarFileId: null, uncertain: false },
    { avatarFileId: 'new', uncertain: true },
  ])(
    'starts a fresh GET after mutation: avatar=$avatarFileId, uncertain=$uncertain',
    async ({ avatarFileId, uncertain }) => {
      let resolveOldProfile!: (profile: Profile) => void
      const oldProfilePromise = new Promise<Profile>((resolve) => {
        resolveOldProfile = resolve
      })
      vi.mocked(getProfile)
        .mockReturnValueOnce(oldProfilePromise)
        .mockResolvedValue({ ...PROFILE, avatarFileId })
      const operation = createAvatarChangeOperation()
      let backgroundGet: Promise<Profile> | undefined
      const request = vi.fn(async () => {
        backgroundGet = queryClient.fetchQuery({
          queryKey: profileQueryKeys.current(),
          queryFn: getProfile,
          staleTime: 0,
          retry: false,
        })
        if (uncertain) {
          throw new Error('offline')
        }
      })

      const changePromise = changeProfileAvatar(queryClient, operation, avatarFileId, request)
      try {
        await vi.waitFor(() => expect(getProfile).toHaveBeenCalledTimes(2))
      } finally {
        resolveOldProfile(PROFILE)
        await Promise.allSettled([changePromise, backgroundGet])
      }
      await changePromise
      expect(operation.applied).toBe(true)
      expect(avatarId()).toBe(avatarFileId)

      await oldProfilePromise
      await backgroundGet
      expect(avatarId()).toBe(avatarFileId)
      expect(request).toHaveBeenCalledTimes(1)
    }
  )
  it('keeps the previous avatar until PUT succeeds then refreshes the profile', async () => {
    vi.mocked(getProfile).mockResolvedValue({ ...PROFILE, avatarFileId: 'new' })
    const request = vi.fn(async () => {
      expect(avatarId()).toBe('old')
    })
    await changeProfileAvatar(queryClient, createAvatarChangeOperation(), 'new', request)
    expect(getProfile).toHaveBeenCalledTimes(1)
    expect(avatarId()).toBe('new')
  })
  it('preserves the profile and concurrent changes on a definite rejection', async () => {
    const request = vi.fn(async () => {
      queryClient.setQueryData(profileQueryKeys.current(), {
        ...PROFILE,
        userName: 'updated',
        avatarFileId: 'concurrent-avatar',
      })
      throw new ProfileAvatarRequestError(409, 'locked')
    })
    await expect(
      changeProfileAvatar(queryClient, createAvatarChangeOperation(), 'new', request)
    ).rejects.toThrow('locked')
    expect(avatarId()).toBe('concurrent-avatar')
    expect(queryClient.getQueryData<Profile>(profileQueryKeys.current())?.userName).toBe('updated')
  })
  it('accepts a network failure when GET confirms installation', async () => {
    vi.mocked(getProfile).mockResolvedValue({ ...PROFILE, avatarFileId: 'new' })
    await changeProfileAvatar(queryClient, createAvatarChangeOperation(), 'new', async () => {
      throw new Error('offline')
    })
    expect(avatarId()).toBe('new')
  })
  it('reuses the original key after a network failure with the old avatar', async () => {
    const operation = createAvatarChangeOperation()
    const originalKey = operation.idempotencyKey
    const request = vi
      .fn<(key: string) => Promise<void>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue(undefined)
    await expect(changeProfileAvatar(queryClient, operation, 'new', request)).rejects.toThrow(
      'offline'
    )
    vi.mocked(getProfile).mockResolvedValue({ ...PROFILE, avatarFileId: 'new' })
    await changeProfileAvatar(queryClient, operation, 'new', request)
    expect(request.mock.calls.map(([key]) => key)).toEqual([originalKey, originalKey])
  })
  it('uses a new key only after 503 and a successful GET with the previous avatar', async () => {
    const operation = createAvatarChangeOperation()
    const originalKey = operation.idempotencyKey
    const request = vi
      .fn<(key: string) => Promise<void>>()
      .mockRejectedValueOnce(new ProfileAvatarRequestError(503, 'unavailable'))
      .mockResolvedValue(undefined)
    await expect(changeProfileAvatar(queryClient, operation, 'new', request)).rejects.toThrow(
      'unavailable'
    )
    vi.mocked(getProfile).mockResolvedValue({ ...PROFILE, avatarFileId: 'new' })
    await changeProfileAvatar(queryClient, operation, 'new', request)
    expect(request.mock.calls[0][0]).toBe(originalKey)
    expect(request.mock.calls[1][0]).not.toBe(originalKey)
  })
  it('does not issue another PUT or create a key while reconciliation fails', async () => {
    const operation = createAvatarChangeOperation()
    const originalKey = operation.idempotencyKey
    vi.mocked(getProfile).mockRejectedValue(new Error('GET offline'))
    const request = vi.fn().mockRejectedValue(new ProfileAvatarRequestError(503, 'unavailable'))
    await expect(changeProfileAvatar(queryClient, operation, 'new', request)).rejects.toThrow(
      'Could not confirm'
    )
    await expect(changeProfileAvatar(queryClient, operation, 'new', request)).rejects.toThrow(
      'GET offline'
    )
    expect(operation.idempotencyKey).toBe(originalKey)
    expect(request).toHaveBeenCalledTimes(1)
  })
  it('only refreshes after a successful PUT whose subsequent GET failed', async () => {
    const operation = createAvatarChangeOperation()
    const request = vi.fn<(key: string) => Promise<void>>().mockResolvedValue(undefined)
    vi.mocked(getProfile).mockRejectedValueOnce(new Error('GET offline'))
    await expect(changeProfileAvatar(queryClient, operation, 'new', request)).rejects.toThrow(
      'was saved'
    )
    expect(avatarId()).toBe('new')
    vi.mocked(getProfile).mockResolvedValue({ ...PROFILE, avatarFileId: 'new' })
    await changeProfileAvatar(queryClient, operation, 'new', request)
    expect(request).toHaveBeenCalledTimes(1)
  })
  it('keeps the photo during deletion and reuses the key after a network failure', async () => {
    const operation = createAvatarChangeOperation()
    const key = operation.idempotencyKey
    const request = vi.fn<(key: string) => Promise<void>>(async () => {
      expect(avatarId()).toBe('old')
      throw new Error('offline')
    })
    await expect(changeProfileAvatar(queryClient, operation, null, request)).rejects.toThrow(
      'offline'
    )
    expect(avatarId()).toBe('old')
    request.mockImplementation(async () => {
      expect(avatarId()).toBe('old')
    })
    vi.mocked(getProfile).mockResolvedValue({ ...PROFILE, avatarFileId: null })
    await changeProfileAvatar(queryClient, operation, null, request)
    expect(request.mock.calls.map(([value]) => value)).toEqual([key, key])
    expect(avatarId()).toBeNull()
  })
  it('keeps the previous avatar when both the request and reconciliation fail', async () => {
    vi.mocked(getProfile).mockRejectedValue(new Error('GET offline'))
    await expect(
      changeProfileAvatar(queryClient, createAvatarChangeOperation(), 'new', async () => {
        expect(avatarId()).toBe('old')
        throw new Error('offline')
      })
    ).rejects.toThrow('Could not confirm')
    expect(avatarId()).toBe('old')
  })
})

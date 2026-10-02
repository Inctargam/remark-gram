import { afterEach, describe, expect, it, vi } from 'vitest'

import type { SchemaMyProfileResponseDto } from '@/shared/api/openapi/schema'

const { getMock } = vi.hoisted(() => ({ getMock: vi.fn() }))

vi.mock('@/shared/api/openapi', () => ({ apiClient: { GET: getMock } }))

const { getProfile, mapMyProfile } = await import('./profileApi')

const PROFILE: SchemaMyProfileResponseDto = {
  userId: 42,
  username: 'user123',
  firstName: null,
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  aboutMe: null,
  country: { code: 'US', name: { en: 'United States', ru: 'США' } },
  city: 'Austin',
  avatarFileId: '550e8400-e29b-41d4-a716-446655440000',
}

afterEach(() => getMock.mockReset())

describe('backend profile reading', () => {
  it('keeps the country code and avatar file id while normalizing nullable form fields', () => {
    expect(mapMyProfile(PROFILE)).toMatchObject({
      id: 42,
      userName: 'user123',
      firstName: '',
      lastName: 'Doe',
      country: 'United States',
      countryCode: 'US',
      city: 'Austin',
      aboutMe: '',
      avatarFileId: PROFILE.avatarFileId,
    })
  })

  it('reads the authenticated profile through the typed client', async () => {
    getMock.mockResolvedValue({ data: PROFILE, response: { ok: true, status: 200 } })

    await expect(getProfile()).resolves.toEqual(mapMyProfile(PROFILE))
    expect(getMock).toHaveBeenCalledWith('/api/v1/users/me/profile')
  })

  it('reports an unsuccessful backend response', async () => {
    getMock.mockResolvedValue({ data: undefined, response: { ok: false, status: 401 } })

    await expect(getProfile()).rejects.toThrow('Failed to load profile (401)')
  })
})

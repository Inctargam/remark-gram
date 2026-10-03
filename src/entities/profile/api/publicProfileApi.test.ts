import { afterEach, describe, expect, it, vi } from 'vitest'

const { getMock } = vi.hoisted(() => ({ getMock: vi.fn() }))
vi.mock('@/shared/api/openapi', () => ({ apiClient: { GET: getMock } }))

const { getPublicProfile } = await import('./publicProfileApi')

afterEach(() => getMock.mockReset())

describe('public profile reading', () => {
  it('requests the selected user and keeps their avatar', async () => {
    getMock.mockResolvedValue({
      data: { userId: 99, username: 'otherUser', aboutMe: null, avatarFileId: 'other-avatar' },
      response: { ok: true },
    })

    await expect(getPublicProfile('99')).resolves.toEqual({
      id: 99,
      userName: 'otherUser',
      aboutMe: '',
      avatarFileId: 'other-avatar',
    })
    expect(getMock).toHaveBeenCalledWith('/api/v1/users/{userId}/profile', {
      params: { path: { userId: 99 } },
    })
  })

  it('reports a missing user instead of returning a placeholder', async () => {
    getMock.mockResolvedValue({ response: { ok: false, status: 404 } })
    await expect(getPublicProfile('99')).rejects.toThrow('Failed to load public profile (404)')
  })
})

import { beforeEach, describe, expect, it } from 'vitest'

import {
  deleteProfileAvatarHandler,
  getProfileAvatarImageHandler,
  uploadProfileAvatarHandler,
} from './profileAvatarHandler'
import { getMockProfile, resetMockProfile } from './profileStore'

const createUploadRequest = (type = 'image/png', size = 4) => {
  const formData = new FormData()
  formData.append('file', new Blob([new Uint8Array(size)], { type }), 'avatar.png')

  return new Request('http://localhost/api/mock/profile/avatar', {
    method: 'POST',
    body: formData,
  })
}

beforeEach(() => {
  resetMockProfile()
})

describe('profile avatar mock handlers', () => {
  it('stores an uploaded avatar and returns medium and thumbnail descriptors', async () => {
    const response = await uploadProfileAvatarHandler(createUploadRequest())
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.avatars).toEqual([
      expect.objectContaining({
        url: expect.stringContaining('/api/mock/profile/avatar/image?size=192'),
        width: 192,
        height: 192,
        fileSize: 4,
      }),
      expect.objectContaining({
        url: expect.stringContaining('/api/mock/profile/avatar/image?size=45'),
        width: 45,
        height: 45,
        fileSize: 4,
      }),
    ])
    expect(getMockProfile().avatars).toEqual(result.avatars)
  })

  it('serves the uploaded image without caching', async () => {
    await uploadProfileAvatarHandler(createUploadRequest('image/jpeg'))

    const response = await getProfileAvatarImageHandler()

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('image/jpeg')
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect((await response.arrayBuffer()).byteLength).toBe(4)
  })

  it('rejects unsupported files', async () => {
    const response = await uploadProfileAvatarHandler(createUploadRequest('image/webp'))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      message: 'The photo must be less than 10 Mb and have JPEG or PNG format',
    })
  })

  it('deletes the avatar and its image', async () => {
    await uploadProfileAvatarHandler(createUploadRequest())

    const response = await deleteProfileAvatarHandler()

    await expect(response.json()).resolves.toEqual({ avatars: [] })
    expect(getMockProfile().avatars).toEqual([])
    expect((await getProfileAvatarImageHandler()).status).toBe(404)
  })
})

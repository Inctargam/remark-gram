import { afterEach, describe, expect, it, vi } from 'vitest'

import { publishPostMock } from './publishPostMock'

const createdPost = {
  id: 'created-post-1',
  ownerId: 'mock-user-1',
  ownerUsername: 'UserName',
  ownerAvatarUrl: null,
  images: [],
  description: 'caption',
  createdAt: '2026-08-01T10:00:00.000Z',
  updatedAt: '2026-08-01T10:00:00.000Z',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('publish post mock', () => {
  it('creates the post in the shared posts mock and returns its id', async () => {
    const fetchMock = vi.fn(async () => Response.json(createdPost, { status: 201 }))

    vi.stubGlobal('fetch', fetchMock)

    const result = await publishPostMock({
      description: 'caption',
      photos: [
        {
          file: new File(['photo'], 'photo.jpg', { type: 'image/jpeg' }),
          width: 1080,
          height: 720,
        },
      ],
    })

    expect(result).toEqual({ publicationId: 'created-post-1' })

    const [path, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]

    expect(path).toContain('/posts')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({
      description: 'caption',
      images: [{ url: `data:image/jpeg;base64,${btoa('photo')}`, width: 1080, height: 720 }],
    })
  })
})

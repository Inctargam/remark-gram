import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/baseApi'

import type { Post } from '../model/types'
import {
  canRequestProfilePosts,
  deletePost,
  getPost,
  getProfilePosts,
  updatePost,
} from './postsApi'

const post: Post = {
  id: 'post-1',
  ownerId: 'user-1',
  ownerUsername: 'UserName',
  ownerAvatarUrl: null,
  images: [{ url: 'https://example.com/photo.jpg', width: 1080, height: 1080 }],
  description: 'Mock publication',
  createdAt: '2026-07-01T12:00:00.000Z',
  updatedAt: '2026-07-01T12:00:00.000Z',
}

const fetchMock = vi.fn()

/** Last URL the api module asked `fetch` for. */
const getRequestedUrl = () => String(fetchMock.mock.calls[0]?.[0])
const getRequestInit = () => fetchMock.mock.calls[0]?.[1] as RequestInit

/** A fresh Response per call — a body can only be read once. */
const respondWith = (body: unknown, status = 200) => {
  fetchMock.mockImplementation(
    async () =>
      new Response(status === 204 ? null : JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      })
  )
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_POSTS_API_MOCK', 'true')
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('getProfilePosts', () => {
  it('allows mock profile ids when the mock flag is on', () => {
    expect(canRequestProfilePosts('mock-user-1')).toBe(true)
  })

  it('allows only positive integer author ids for the real backend', () => {
    vi.stubEnv('NEXT_PUBLIC_POSTS_API_MOCK', 'false')

    expect(canRequestProfilePosts('7')).toBe(true)
    expect(canRequestProfilePosts('mock-user-1')).toBe(false)
    expect(canRequestProfilePosts('0')).toBe(false)
  })

  it('requests the first page with the default page size', async () => {
    respondWith({ items: [post], nextCursor: null })

    await expect(getProfilePosts({ userId: 'user-1' })).resolves.toEqual({
      items: [post],
      nextCursor: null,
    })
    expect(getRequestedUrl()).toContain('/api/mock/posts?userId=user-1&pageSize=8')
    expect(getRequestInit().method).toBe('GET')
  })

  it('passes the cursor when loading the next page', async () => {
    respondWith({ items: [], nextCursor: null })

    await getProfilePosts({ userId: 'user-1', cursor: 'post-9', pageSize: 4 })

    expect(getRequestedUrl()).toContain('pageSize=4&cursor=post-9')
  })

  it('omits an empty cursor', async () => {
    respondWith({ items: [], nextCursor: null })

    await getProfilePosts({ userId: 'user-1', cursor: null })

    expect(getRequestedUrl()).not.toContain('cursor=')
  })

  it('targets the real backend path when the mock flag is off', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTS_API_MOCK', 'false')
    respondWith({
      items: [
        {
          id: 42,
          authorId: 7,
          description: 'Real publication',
          createdAt: '2026-08-19T10:00:00.000Z',
          images: [{ fileId: 'file-1', position: 0, url: 'https://example.com/file-1.jpg' }],
        },
      ],
      hasMore: true,
      nextCursor: 'encoded-cursor',
    })

    await expect(getProfilePosts({ userId: '7' })).resolves.toEqual({
      items: [
        {
          id: '42',
          ownerId: '7',
          ownerUsername: 'User 7',
          ownerAvatarUrl: null,
          images: [{ url: 'https://example.com/file-1.jpg', width: 0, height: 0 }],
          description: 'Real publication',
          createdAt: '2026-08-19T10:00:00.000Z',
          updatedAt: '2026-08-19T10:00:00.000Z',
        },
      ],
      nextCursor: 'encoded-cursor',
    })

    expect(getRequestedUrl()).toContain('/api/v1/users/7/posts?limit=8')
    expect(getRequestedUrl()).not.toContain('/api/v1/posts?')
    expect(getRequestedUrl()).not.toContain('userId=')
  })

  it('uses backend cursor pagination params for the real author posts endpoint', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTS_API_MOCK', 'false')
    respondWith({ items: [], nextCursor: null })

    await getProfilePosts({ userId: '7', cursor: 'encoded-cursor', pageSize: 4 })

    expect(getRequestedUrl()).toContain('/api/v1/users/7/posts?limit=4&cursor=encoded-cursor')
  })

  it('does not request the real backend with a mock profile id', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTS_API_MOCK', 'false')

    await expect(getProfilePosts({ userId: 'mock-user-1' })).resolves.toEqual({
      items: [],
      nextCursor: null,
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('getPost', () => {
  it('requests a single post by id', async () => {
    respondWith(post)

    await expect(getPost('post-1')).resolves.toEqual(post)
    expect(getRequestedUrl()).toContain('/api/mock/posts/post-1')
  })

  it('throws ApiError with the server message on a failed request', async () => {
    respondWith({ message: 'Post not found.' }, 404)

    await expect(getPost('missing')).rejects.toThrow(ApiError)
    await expect(getPost('missing')).rejects.toThrow('Post not found.')
  })
})

describe('updatePost', () => {
  it('sends only the description as PATCH body', async () => {
    respondWith({ ...post, description: 'Updated' })

    await expect(updatePost('post-1', { description: 'Updated' })).resolves.toEqual({
      ...post,
      description: 'Updated',
    })
    expect(getRequestedUrl()).toContain('/api/mock/posts/post-1')
    expect(getRequestInit().method).toBe('PATCH')
    expect(getRequestInit().body).toBe(JSON.stringify({ description: 'Updated' }))
  })
})

describe('deletePost', () => {
  it('sends DELETE and resolves without a body', async () => {
    respondWith(null, 204)

    await expect(deletePost('post-1')).resolves.toBeUndefined()
    expect(getRequestedUrl()).toContain('/api/mock/posts/post-1')
    expect(getRequestInit().method).toBe('DELETE')
  })
})

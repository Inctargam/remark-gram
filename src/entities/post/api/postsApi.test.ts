import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/baseApi'

import type { Post } from '../model/types'
import { createPost, deletePost, getPost, getProfilePosts, updatePost } from './postsApi'

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
    respondWith({ items: [], nextCursor: null })

    await getProfilePosts({ userId: 'user-1' })

    expect(getRequestedUrl()).toContain('/api/v1/posts?')
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

describe('createPost', () => {
  it('posts the description with the images to the collection path', async () => {
    respondWith(post, 201)

    await expect(createPost({ description: 'New', images: post.images })).resolves.toEqual(post)
    expect(getRequestedUrl()).toContain('/api/mock/posts')
    expect(getRequestInit().method).toBe('POST')
    expect(getRequestInit().body).toBe(JSON.stringify({ description: 'New', images: post.images }))
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

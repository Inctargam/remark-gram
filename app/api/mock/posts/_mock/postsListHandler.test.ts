import { beforeEach, describe, expect, it } from 'vitest'

import type { PostsPage } from '@/entities/post'
import { MOCK_CURRENT_USER_ID } from '@/shared/auth'

import { createPostHandler, getPostsListHandler } from './postsListHandler'
import { resetPostsMockStore } from './postsStore'

const MOCK_API_ORIGIN = 'https://dev.remark-gram.com:3000/api/mock/posts'

const createListRequest = (query: string) => new Request(`${MOCK_API_ORIGIN}?${query}`)

const createCreateRequest = (payload: unknown) =>
  new Request(MOCK_API_ORIGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

const validImages = [{ url: 'data:image/svg+xml;utf8,<svg/>', width: 1080, height: 1080 }]

beforeEach(() => {
  resetPostsMockStore()
})

describe('getPostsListHandler', () => {
  it('returns the first page with the default page size', async () => {
    const response = await getPostsListHandler(createListRequest(`userId=${MOCK_CURRENT_USER_ID}`))
    const page: PostsPage = await response.json()

    expect(response.status).toBe(200)
    expect(page.items).toHaveLength(8)
    expect(page.nextCursor).not.toBeNull()
  })

  it('honours cursor and pageSize', async () => {
    const response = await getPostsListHandler(
      createListRequest(`userId=${MOCK_CURRENT_USER_ID}&pageSize=5`)
    )
    const firstPage: PostsPage = await response.json()
    const nextResponse = await getPostsListHandler(
      createListRequest(`userId=${MOCK_CURRENT_USER_ID}&pageSize=5&cursor=${firstPage.nextCursor}`)
    )
    const secondPage: PostsPage = await nextResponse.json()

    expect(firstPage.items).toHaveLength(5)
    expect(secondPage.items[0]?.id).toBe(firstPage.nextCursor)
  })

  it('rejects a request without userId', async () => {
    const response = await getPostsListHandler(createListRequest('pageSize=8'))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ message: 'userId is required.' })
  })

  it('rejects an unusable pageSize', async () => {
    const response = await getPostsListHandler(
      createListRequest(`userId=${MOCK_CURRENT_USER_ID}&pageSize=0`)
    )

    expect(response.status).toBe(400)
  })

  it('rejects an unknown cursor', async () => {
    const response = await getPostsListHandler(
      createListRequest(`userId=${MOCK_CURRENT_USER_ID}&cursor=missing`)
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ message: 'Unknown cursor.' })
  })
})

describe('createPostHandler', () => {
  it('creates a post and returns it first in the feed', async () => {
    const response = await createPostHandler(
      createCreateRequest({ description: 'Fresh publication', images: validImages })
    )
    const created = await response.json()
    const listResponse = await getPostsListHandler(
      createListRequest(`userId=${MOCK_CURRENT_USER_ID}`)
    )
    const page: PostsPage = await listResponse.json()

    expect(response.status).toBe(201)
    expect(page.items[0]).toEqual(created)
  })

  it('rejects a description longer than the limit', async () => {
    const response = await createPostHandler(
      createCreateRequest({ description: 'a'.repeat(501), images: validImages })
    )

    expect(response.status).toBe(400)
  })

  it('rejects a post without images', async () => {
    const response = await createPostHandler(createCreateRequest({ description: '', images: [] }))

    expect(response.status).toBe(400)
  })
})

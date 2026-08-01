import { beforeEach, describe, expect, it } from 'vitest'

import type { Post } from '@/entities/post'

import { deletePostHandler, getPostHandler, updatePostHandler } from './postHandler'
import { listPosts, MOCK_CURRENT_USER_ID, resetPostsMockStore } from './postsStore'

const createPatchRequest = (payload: unknown, postId: string) =>
  new Request(`https://dev.remark-gram.com:3000/api/mock/posts/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

const getSeededPost = () => listPosts({ userId: MOCK_CURRENT_USER_ID, pageSize: 1 })!.items[0]!

beforeEach(() => {
  resetPostsMockStore()
})

describe('getPostHandler', () => {
  it('returns an existing post', async () => {
    const seeded = getSeededPost()
    const response = await getPostHandler(seeded.id)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(seeded)
  })

  it('returns 404 for an unknown post', async () => {
    const response = await getPostHandler('missing')

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({ message: 'Post not found.' })
  })
})

describe('updatePostHandler', () => {
  it('changes only the description', async () => {
    const seeded = getSeededPost()
    const response = await updatePostHandler(
      createPatchRequest({ description: 'Updated description' }, seeded.id),
      seeded.id
    )
    const updated: Post = await response.json()

    expect(response.status).toBe(200)
    expect(updated).toMatchObject({
      id: seeded.id,
      images: seeded.images,
      createdAt: seeded.createdAt,
      description: 'Updated description',
    })
  })

  it('accepts an empty description', async () => {
    const seeded = getSeededPost()
    const response = await updatePostHandler(
      createPatchRequest({ description: '' }, seeded.id),
      seeded.id
    )

    expect(response.status).toBe(200)
  })

  it('rejects a description over the limit', async () => {
    const seeded = getSeededPost()
    const response = await updatePostHandler(
      createPatchRequest({ description: 'a'.repeat(501) }, seeded.id),
      seeded.id
    )

    expect(response.status).toBe(400)
  })

  it('rejects a body without a description', async () => {
    const seeded = getSeededPost()
    const response = await updatePostHandler(createPatchRequest({}, seeded.id), seeded.id)

    expect(response.status).toBe(400)
  })

  it('returns 404 for an unknown post', async () => {
    const response = await updatePostHandler(
      createPatchRequest({ description: 'text' }, 'missing'),
      'missing'
    )

    expect(response.status).toBe(404)
  })
})

describe('deletePostHandler', () => {
  it('removes the post and answers 204', async () => {
    const seeded = getSeededPost()
    const response = await deletePostHandler(seeded.id)

    expect(response.status).toBe(204)
    expect((await getPostHandler(seeded.id)).status).toBe(404)
  })

  it('returns 404 on a repeated delete', async () => {
    const seeded = getSeededPost()

    await deletePostHandler(seeded.id)

    expect((await deletePostHandler(seeded.id)).status).toBe(404)
  })
})

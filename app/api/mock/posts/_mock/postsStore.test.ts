import { beforeEach, describe, expect, it } from 'vitest'

import {
  createPost,
  deletePost,
  findPost,
  listPosts,
  MOCK_CURRENT_USER_ID,
  MOCK_OTHER_USER_ID,
  resetPostsMockStore,
  updatePostDescription,
} from './postsStore'

const PAGE_SIZE = 8

const listFirstPage = () => listPosts({ userId: MOCK_CURRENT_USER_ID, pageSize: PAGE_SIZE })

beforeEach(() => {
  resetPostsMockStore()
})

describe('listPosts', () => {
  it('returns exactly one page and points the cursor at the next post', () => {
    const page = listFirstPage()
    const allPosts = listPosts({ userId: MOCK_CURRENT_USER_ID, pageSize: 100 })

    expect(page?.items).toHaveLength(PAGE_SIZE)
    expect(page?.nextCursor).toBe(allPosts?.items[PAGE_SIZE]?.id)
  })

  it('walks the whole feed page by page and ends with a null cursor', () => {
    const firstPage = listFirstPage()
    const secondPage = listPosts({
      userId: MOCK_CURRENT_USER_ID,
      cursor: firstPage?.nextCursor,
      pageSize: PAGE_SIZE,
    })
    const lastPage = listPosts({
      userId: MOCK_CURRENT_USER_ID,
      cursor: secondPage?.nextCursor,
      pageSize: PAGE_SIZE,
    })

    expect(secondPage?.items).toHaveLength(PAGE_SIZE)
    expect(lastPage?.items).toHaveLength(4)
    expect(lastPage?.nextCursor).toBeNull()
  })

  it('does not repeat posts across pages', () => {
    const firstPage = listFirstPage()
    const secondPage = listPosts({
      userId: MOCK_CURRENT_USER_ID,
      cursor: firstPage?.nextCursor,
      pageSize: PAGE_SIZE,
    })
    const ids = [...(firstPage?.items ?? []), ...(secondPage?.items ?? [])].map((post) => post.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('orders posts from newest to oldest', () => {
    const timestamps = (listFirstPage()?.items ?? []).map((post) =>
      new Date(post.createdAt).getTime()
    )

    expect(timestamps).toEqual([...timestamps].sort((first, second) => second - first))
  })

  it('returns only posts of the requested user', () => {
    const page = listPosts({ userId: MOCK_OTHER_USER_ID, pageSize: PAGE_SIZE })

    expect(page?.items).toHaveLength(4)
    expect(page?.items.every((post) => post.ownerId === MOCK_OTHER_USER_ID)).toBe(true)
  })

  it('returns an empty page for a user without posts', () => {
    expect(listPosts({ userId: 'unknown-user', pageSize: PAGE_SIZE })).toEqual({
      items: [],
      nextCursor: null,
    })
  })

  it('returns null for an unknown cursor', () => {
    expect(
      listPosts({ userId: MOCK_CURRENT_USER_ID, cursor: 'missing', pageSize: PAGE_SIZE })
    ).toBeNull()
  })
})

describe('updatePostDescription', () => {
  it('changes the description and leaves the rest of the post untouched', () => {
    const original = listFirstPage()?.items[0]
    const updated = updatePostDescription(original!.id, 'Updated description')

    expect(updated).toMatchObject({
      id: original!.id,
      ownerId: original!.ownerId,
      images: original!.images,
      createdAt: original!.createdAt,
      description: 'Updated description',
    })
  })

  it('returns null for an unknown post', () => {
    expect(updatePostDescription('missing', 'text')).toBeNull()
  })
})

describe('deletePost', () => {
  it('removes the post from later listings', () => {
    const target = listFirstPage()!.items[0]!

    expect(deletePost(target.id)).toBe(true)
    expect(findPost(target.id)).toBeNull()
    expect(listFirstPage()?.items.some((post) => post.id === target.id)).toBe(false)
  })

  it('returns false on a repeated delete', () => {
    const target = listFirstPage()!.items[0]!

    deletePost(target.id)

    expect(deletePost(target.id)).toBe(false)
  })
})

describe('createPost', () => {
  it('puts a new post at the top of the owner feed', () => {
    const created = createPost({
      description: 'Fresh publication',
      images: [{ url: 'data:image/svg+xml;utf8,<svg/>', width: 1080, height: 1080 }],
    })

    expect(created.ownerId).toBe(MOCK_CURRENT_USER_ID)
    expect(listFirstPage()?.items[0]).toEqual(created)
  })
})

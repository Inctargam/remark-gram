import type { PostImage } from '@/entities/post'
import {
  isValidPostDescription,
  POST_DESCRIPTION_MAX_LENGTH,
  PROFILE_POSTS_PAGE_SIZE,
} from '@/entities/post'
import { createPost, listLatestPosts, listPosts } from '@/shared/api/mock/postsStore'

/** A caller that sends no `pageSize` gets what the profile feed asks for anyway. */
const DEFAULT_PAGE_SIZE = PROFILE_POSTS_PAGE_SIZE
const MAX_PAGE_SIZE = 50

const parseIntegerParam = (raw: string | null, max: number): number | null => {
  if (raw === null) {
    return null
  }

  const value = Number(raw)

  return Number.isInteger(value) && value > 0 && value <= max ? value : null
}

export const getPostsListHandler = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const limit = parseIntegerParam(searchParams.get('limit'), MAX_PAGE_SIZE)

  if (userId) {
    const pageSize = searchParams.get('pageSize')
      ? parseIntegerParam(searchParams.get('pageSize'), MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE

    if (pageSize === null) {
      return Response.json(
        { message: `pageSize must be an integer between 1 and ${MAX_PAGE_SIZE}.` },
        { status: 400 }
      )
    }

    const page = listPosts({ userId, cursor: searchParams.get('cursor'), pageSize })

    if (!page) {
      return Response.json({ message: 'Unknown cursor.' }, { status: 400 })
    }

    return Response.json(page)
  }

  if (limit) {
    const items = listLatestPosts(limit)

    return Response.json({ items, nextCursor: null })
  }

  return Response.json({ message: 'userId or limit is required.' }, { status: 400 })
}

type CreatePostRequestBody = {
  ownerId?: unknown
  description?: unknown
  images?: unknown
}

const isPostImage = (image: unknown): image is PostImage => {
  if (typeof image !== 'object' || image === null) {
    return false
  }

  const { url, width, height } = image as Record<string, unknown>

  return typeof url === 'string' && typeof width === 'number' && typeof height === 'number'
}

export const createPostHandler = async (request: Request) => {
  const body: CreatePostRequestBody | null = await request.json().catch(() => null)
  const description = body?.description ?? ''
  const images = body?.images

  if (typeof description !== 'string' || !isValidPostDescription(description)) {
    return Response.json(
      { message: `description must be a string up to ${POST_DESCRIPTION_MAX_LENGTH} characters.` },
      { status: 400 }
    )
  }

  if (!Array.isArray(images) || images.length === 0 || !images.every(isPostImage)) {
    return Response.json({ message: 'images must be a non-empty array.' }, { status: 400 })
  }

  const post = createPost({
    ownerId: typeof body?.ownerId === 'string' ? body.ownerId : undefined,
    description,
    images,
  })

  return Response.json(post, { status: 201 })
}

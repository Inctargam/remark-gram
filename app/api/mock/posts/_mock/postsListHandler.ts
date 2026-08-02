import type { PostImage } from '@/entities/post'
import {
  isValidPostDescription,
  POST_DESCRIPTION_MAX_LENGTH,
  PROFILE_POSTS_PAGE_SIZE,
} from '@/entities/post'

import { createPost, listPosts } from './postsStore'

/** A caller that sends no `pageSize` gets what the profile feed asks for anyway. */
const DEFAULT_PAGE_SIZE = PROFILE_POSTS_PAGE_SIZE
const MAX_PAGE_SIZE = 50

const parsePageSize = (rawPageSize: string | null): number | null => {
  if (rawPageSize === null) {
    return DEFAULT_PAGE_SIZE
  }

  const pageSize = Number(rawPageSize)
  const isUsablePageSize = Number.isInteger(pageSize) && pageSize > 0 && pageSize <= MAX_PAGE_SIZE

  return isUsablePageSize ? pageSize : null
}

export const getPostsListHandler = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return Response.json({ message: 'userId is required.' }, { status: 400 })
  }

  const pageSize = parsePageSize(searchParams.get('pageSize'))

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

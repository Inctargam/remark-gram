import { describe, expect, it } from 'vitest'

import { ApiError } from '@/shared/api/baseApi'

import { CREATE_POST_FILE_ERROR, CREATE_POST_PHOTOS_LIMIT_ERROR } from './createPostFile'
import {
  CREATE_POST_DESCRIPTION_ERROR,
  CREATE_POST_PUBLISH_ERROR,
  CREATE_POST_SERVICE_ERROR,
  CREATE_POST_SESSION_ERROR,
  getCreatePostPublishErrorMessage,
} from './createPostPublishError'

describe('getCreatePostPublishErrorMessage', () => {
  it('maps expired session errors', () => {
    expect(getCreatePostPublishErrorMessage(new ApiError(401, { message: 'Unauthorized' }))).toBe(
      CREATE_POST_SESSION_ERROR
    )
  })

  it.each([
    new ApiError(400, {
      code: 'INVALID_POST_DESCRIPTION',
      message: 'Post description must not exceed 500 characters',
    }),
    new ApiError(400, { message: 'description must be shorter than 500 characters' }),
  ])('maps description validation errors', (error) => {
    expect(getCreatePostPublishErrorMessage(error)).toBe(CREATE_POST_DESCRIPTION_ERROR)
  })

  it.each([
    new ApiError(400, {
      code: 'INVALID_POST_IMAGE_COUNT',
      message: 'Post image count must be between 1 and 10',
    }),
    new ApiError(400, { message: 'Image count must be between 1 and 10' }),
  ])('maps image count errors', (error) => {
    expect(getCreatePostPublishErrorMessage(error)).toBe(CREATE_POST_PHOTOS_LIMIT_ERROR)
  })

  it.each([
    new ApiError(400, {
      code: 'UNSUPPORTED_IMAGE_CONTENT_TYPE',
      message: 'Unsupported image content type: image/webp',
    }),
    new ApiError(400, {
      code: 'INVALID_IMAGE_SIZE',
      message: 'Image size must be between 1 and 20971520 bytes',
    }),
  ])('maps image file validation errors', (error) => {
    expect(getCreatePostPublishErrorMessage(error)).toBe(CREATE_POST_FILE_ERROR)
  })

  it('maps backend service errors', () => {
    expect(
      getCreatePostPublishErrorMessage(
        new ApiError(503, {
          code: 'IMAGE_UPLOADS_SERVICE_UNAVAILABLE',
          message: 'The image uploads service is unavailable',
        })
      )
    ).toBe(CREATE_POST_SERVICE_ERROR)
  })

  it('falls back to the generic publish error for unknown failures', () => {
    expect(getCreatePostPublishErrorMessage(new Error('Network failed'))).toBe(
      CREATE_POST_PUBLISH_ERROR
    )
    expect(getCreatePostPublishErrorMessage(new ApiError(409, { message: 'Conflict' }))).toBe(
      CREATE_POST_PUBLISH_ERROR
    )
  })
})

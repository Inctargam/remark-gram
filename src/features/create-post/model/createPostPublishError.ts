import { ApiError } from '@/shared/api/baseApi'

import { CREATE_POST_FILE_ERROR, CREATE_POST_PHOTOS_LIMIT_ERROR } from './createPostFile'

export const CREATE_POST_DESCRIPTION_ERROR = 'Description must be 500 characters or less'
export const CREATE_POST_SESSION_ERROR = 'Your session has expired. Please sign in again'
export const CREATE_POST_SERVICE_ERROR =
  'Publication service is unavailable. Please try again later'
export const CREATE_POST_PUBLISH_ERROR = 'Failed to publish the post. Please try again.'

const DESCRIPTION_ERROR_CODES = new Set(['INVALID_POST_DESCRIPTION'])
const IMAGE_COUNT_ERROR_CODES = new Set(['INVALID_IMAGE_COUNT', 'INVALID_POST_IMAGE_COUNT'])
const IMAGE_FILE_ERROR_CODES = new Set([
  'INVALID_IMAGE_SIZE',
  'UNSUPPORTED_IMAGE_CONTENT_TYPE',
  'IMAGE_UPLOAD_METADATA_MISMATCH',
])
const SERVICE_ERROR_CODES = new Set([
  'IMAGE_UPLOADS_SERVICE_UNAVAILABLE',
  'POSTS_SERVICE_UNAVAILABLE',
])

const includesAny = (message: string, patterns: string[]) =>
  patterns.some((pattern) => message.includes(pattern))

export const getCreatePostPublishErrorMessage = (error: unknown): string => {
  if (!(error instanceof ApiError)) {
    return CREATE_POST_PUBLISH_ERROR
  }

  const code = error.data?.code
  const message = error.data?.message.toLowerCase() ?? ''

  if (error.status === 401) {
    return CREATE_POST_SESSION_ERROR
  }

  if ((code && DESCRIPTION_ERROR_CODES.has(code)) || includesAny(message, ['description', '500'])) {
    return CREATE_POST_DESCRIPTION_ERROR
  }

  if (
    (code && IMAGE_COUNT_ERROR_CODES.has(code)) ||
    includesAny(message, ['image count', 'between 1 and 10', 'upload count'])
  ) {
    return CREATE_POST_PHOTOS_LIMIT_ERROR
  }

  if (
    (code && IMAGE_FILE_ERROR_CODES.has(code)) ||
    includesAny(message, ['content type', 'file size', 'image size', 'metadata'])
  ) {
    return CREATE_POST_FILE_ERROR
  }

  if (error.status === 503 || error.status === 502 || (code && SERVICE_ERROR_CODES.has(code))) {
    return CREATE_POST_SERVICE_ERROR
  }

  return CREATE_POST_PUBLISH_ERROR
}

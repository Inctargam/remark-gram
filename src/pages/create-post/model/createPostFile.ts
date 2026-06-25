export const MAX_CREATE_POST_PHOTOS = 10
export const MAX_CREATE_POST_PHOTO_SIZE_BYTES = 20 * 1024 * 1024
export const CREATE_POST_FILE_ERROR =
  'The photo must be less than 20 Mb and have JPEG or PNG format'
export const CREATE_POST_PHOTOS_LIMIT_ERROR = 'You can upload up to 10 photos'

const CREATE_POST_PHOTO_TYPES = ['image/jpeg', 'image/png'] as const

export type CreatePostPhoto = {
  id: string
  file: File
  previewUrl: string
}

type CreatePostFileCandidate = Pick<File, 'size' | 'type'>

type CreatePostFilesValidationResult =
  | {
      isValid: true
      error: null
    }
  | {
      isValid: false
      error: string
    }

const isAcceptedPhotoType = (type: string) =>
  CREATE_POST_PHOTO_TYPES.includes(type as (typeof CREATE_POST_PHOTO_TYPES)[number])

const isAcceptedPhotoSize = (size: number) => size <= MAX_CREATE_POST_PHOTO_SIZE_BYTES

export const validateCreatePostFiles = (
  files: CreatePostFileCandidate[],
  currentPhotosCount = 0
): CreatePostFilesValidationResult => {
  const nextPhotosCount = currentPhotosCount + files.length

  if (files.length === 0) {
    return { isValid: true, error: null }
  }

  if (currentPhotosCount >= MAX_CREATE_POST_PHOTOS || nextPhotosCount > MAX_CREATE_POST_PHOTOS) {
    return { isValid: false, error: CREATE_POST_PHOTOS_LIMIT_ERROR }
  }

  const hasInvalidFile = files.some(
    ({ size, type }) => !isAcceptedPhotoType(type) || !isAcceptedPhotoSize(size)
  )

  if (hasInvalidFile) {
    return { isValid: false, error: CREATE_POST_FILE_ERROR }
  }

  return { isValid: true, error: null }
}

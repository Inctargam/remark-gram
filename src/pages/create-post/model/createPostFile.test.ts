import { describe, expect, it } from 'vitest'

import {
  CREATE_POST_FILE_ERROR,
  CREATE_POST_PHOTOS_LIMIT_ERROR,
  MAX_CREATE_POST_PHOTO_SIZE_BYTES,
  validateCreatePostFiles,
} from './createPostFile'

const createFileCandidate = (type: string, size = 1024) => ({ type, size }) as File

describe('create post file validation', () => {
  it('accepts JPEG and PNG files up to 20 Mb', () => {
    expect(
      validateCreatePostFiles([
        createFileCandidate('image/jpeg', MAX_CREATE_POST_PHOTO_SIZE_BYTES),
        createFileCandidate('image/png'),
      ])
    ).toEqual({ isValid: true, error: null })
  })

  it.each([
    [createFileCandidate('image/webp'), CREATE_POST_FILE_ERROR],
    [
      createFileCandidate('image/jpeg', MAX_CREATE_POST_PHOTO_SIZE_BYTES + 1),
      CREATE_POST_FILE_ERROR,
    ],
    [
      createFileCandidate('image/png', MAX_CREATE_POST_PHOTO_SIZE_BYTES + 1),
      CREATE_POST_FILE_ERROR,
    ],
  ])('rejects invalid file %j', (file, expectedError) => {
    expect(validateCreatePostFiles([file])).toEqual({ isValid: false, error: expectedError })
  })

  it('rejects more than 10 files in one upload', () => {
    const files = Array.from({ length: 11 }, () => createFileCandidate('image/jpeg'))

    expect(validateCreatePostFiles(files)).toEqual({
      isValid: false,
      error: CREATE_POST_PHOTOS_LIMIT_ERROR,
    })
  })

  it('rejects files when they exceed the remaining photo slots', () => {
    expect(validateCreatePostFiles([createFileCandidate('image/jpeg')], 10)).toEqual({
      isValid: false,
      error: CREATE_POST_PHOTOS_LIMIT_ERROR,
    })
  })

  it('ignores an empty file selection', () => {
    expect(validateCreatePostFiles([])).toEqual({ isValid: true, error: null })
  })
})

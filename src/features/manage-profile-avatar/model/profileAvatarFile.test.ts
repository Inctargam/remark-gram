import { describe, expect, it } from 'vitest'

import {
  MAX_PROFILE_AVATAR_SIZE_BYTES,
  PROFILE_AVATAR_FILE_ERROR,
  validateProfileAvatar,
} from './profileAvatarFile'

const createFile = (type: string, size: number) => ({ type, size }) as File

describe('validateProfileAvatar', () => {
  it.each(['image/jpeg', 'image/png'])('accepts %s up to 10 Mb', (type) => {
    expect(validateProfileAvatar(createFile(type, MAX_PROFILE_AVATAR_SIZE_BYTES))).toBe(true)
  })

  it.each([
    createFile('image/webp', 1024),
    createFile('image/jpeg', MAX_PROFILE_AVATAR_SIZE_BYTES + 1),
  ])(`rejects invalid files with "${PROFILE_AVATAR_FILE_ERROR}"`, (file) => {
    expect(validateProfileAvatar(file)).toBe(false)
  })
})

import { isValidJpegOrPngImage } from '@/shared/lib/image-file'

export const MAX_PROFILE_AVATAR_SIZE_BYTES = 10 * 1024 * 1024
export const PROFILE_AVATAR_FILE_ERROR =
  'The photo must be less than 10 Mb and have JPEG or PNG format'

export const validateProfileAvatar = (file: File) => {
  return isValidJpegOrPngImage(file, MAX_PROFILE_AVATAR_SIZE_BYTES)
}

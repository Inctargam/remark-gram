export const JPEG_PNG_IMAGE_TYPES = ['image/jpeg', 'image/png'] as const
export const JPEG_PNG_IMAGE_ACCEPT = JPEG_PNG_IMAGE_TYPES.join(',')

type ImageFileCandidate = Pick<File, 'size' | 'type'>

const isJpegOrPngImage = (type: string) =>
  JPEG_PNG_IMAGE_TYPES.includes(type as (typeof JPEG_PNG_IMAGE_TYPES)[number])

export const isValidJpegOrPngImage = (file: ImageFileCandidate, maxSizeBytes: number) => {
  return isJpegOrPngImage(file.type) && file.size <= maxSizeBytes
}

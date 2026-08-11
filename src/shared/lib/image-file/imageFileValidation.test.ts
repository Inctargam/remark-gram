import { describe, expect, it } from 'vitest'

import { isValidJpegOrPngImage } from './imageFileValidation'

const MAX_SIZE_BYTES = 10

describe('isValidJpegOrPngImage', () => {
  it.each(['image/jpeg', 'image/png'])('accepts %s at the size limit', (type) => {
    expect(isValidJpegOrPngImage({ size: MAX_SIZE_BYTES, type }, MAX_SIZE_BYTES)).toBe(true)
  })

  it('rejects an unsupported image type', () => {
    expect(
      isValidJpegOrPngImage({ size: MAX_SIZE_BYTES, type: 'image/webp' }, MAX_SIZE_BYTES)
    ).toBe(false)
  })

  it('rejects a file larger than the size limit', () => {
    expect(
      isValidJpegOrPngImage({ size: MAX_SIZE_BYTES + 1, type: 'image/png' }, MAX_SIZE_BYTES)
    ).toBe(false)
  })
})

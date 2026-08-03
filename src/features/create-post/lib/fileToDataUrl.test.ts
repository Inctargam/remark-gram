import { describe, expect, it } from 'vitest'

import { fileToDataUrl } from './fileToDataUrl'

describe('file to data url', () => {
  it('inlines the file content as base64 with its mime type', async () => {
    const file = new File(['hello'], 'photo.png', { type: 'image/png' })

    await expect(fileToDataUrl(file)).resolves.toBe(`data:image/png;base64,${btoa('hello')}`)
  })

  it('falls back to jpeg when the file carries no type', async () => {
    const file = new File(['hello'], 'photo')

    await expect(fileToDataUrl(file)).resolves.toBe(`data:image/jpeg;base64,${btoa('hello')}`)
  })

  it('encodes files larger than a single chunk', async () => {
    const content = 'a'.repeat(0x8000 * 2 + 5)
    const file = new File([content], 'photo.jpg', { type: 'image/jpeg' })

    await expect(fileToDataUrl(file)).resolves.toBe(`data:image/jpeg;base64,${btoa(content)}`)
  })
})

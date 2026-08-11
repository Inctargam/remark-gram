import { describe, expect, it } from 'vitest'

import type { ProfileAvatar } from './profileTypes'
import { selectLargestProfileAvatar } from './selectProfileAvatar'

const createAvatar = (width: number): ProfileAvatar => ({
  url: `/avatar-${width}.jpg`,
  width,
  height: width,
  fileSize: width,
  createdAt: '2026-08-06T14:41:15.904Z',
})

describe('selectLargestProfileAvatar', () => {
  it('returns the avatar with the greatest width regardless of array order', () => {
    expect(selectLargestProfileAvatar([createAvatar(45), createAvatar(192)])?.width).toBe(192)
  })

  it('returns null for an empty list', () => {
    expect(selectLargestProfileAvatar([])).toBeNull()
  })
})

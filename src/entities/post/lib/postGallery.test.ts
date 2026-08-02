import { describe, expect, it } from 'vitest'

import { getGalleryIndex, hasGalleryControls } from './postGallery'

describe('getGalleryIndex', () => {
  it('moves forward inside the gallery', () => {
    expect(getGalleryIndex(0, 3, 1)).toBe(1)
  })

  it('moves backward inside the gallery', () => {
    expect(getGalleryIndex(2, 3, -1)).toBe(1)
  })

  it('stops on the last image instead of wrapping around', () => {
    expect(getGalleryIndex(2, 3, 1)).toBe(2)
  })

  it('stops on the first image instead of wrapping around', () => {
    expect(getGalleryIndex(0, 3, -1)).toBe(0)
  })

  it('clamps an index that is out of the gallery bounds', () => {
    expect(getGalleryIndex(9, 3, -1)).toBe(1)
    expect(getGalleryIndex(-4, 3, 1)).toBe(1)
  })

  it('returns 0 for an empty gallery', () => {
    expect(getGalleryIndex(0, 0, 1)).toBe(0)
  })
})

describe('hasGalleryControls', () => {
  it('hides the controls for a single image', () => {
    expect(hasGalleryControls(1)).toBe(false)
    expect(hasGalleryControls(0)).toBe(false)
  })

  it('shows the controls for several images', () => {
    expect(hasGalleryControls(2)).toBe(true)
  })
})

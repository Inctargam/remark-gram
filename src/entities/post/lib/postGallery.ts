/**
 * Gallery navigation kept as pure functions: the carousel state in `PostView` is a single
 * index, and the unit project (node environment) can cover the stepping rules without a DOM.
 */
export type GalleryStep = -1 | 1

/** Index after a step, clamped to the gallery bounds. Out-of-range input falls back to 0. */
export const getGalleryIndex = (currentIndex: number, total: number, step: GalleryStep): number => {
  if (total <= 0) {
    return 0
  }

  const safeIndex = Math.min(Math.max(currentIndex, 0), total - 1)

  return Math.min(Math.max(safeIndex + step, 0), total - 1)
}

/** A single image needs no arrows and no dots. */
export const hasGalleryControls = (total: number): boolean => total > 1

import { beforeEach, describe, expect, it } from 'vitest'

import {
  clearCreatePostDraft,
  createPostDraftFromState,
  getCreatePostDraft,
  saveCreatePostDraft,
} from './createPostDraft'
import type { CreatePostPhoto } from './createPostFile'

const createFile = (name: string) => new File(['photo'], name, { type: 'image/png' })

const createPhoto = (id: string): CreatePostPhoto => ({
  id,
  file: createFile(`${id}.png`),
  previewUrl: `blob:${id}`,
  crop: { x: 4, y: 8 },
  zoom: 1.4,
  aspectId: '4:5',
  croppedAreaPixels: { x: 1, y: 2, width: 320, height: 400 },
  imageSize: { width: 800, height: 1000 },
  filterId: 'clarendon',
})

describe('create post draft', () => {
  beforeEach(() => {
    clearCreatePostDraft()
  })

  it('saves and returns an in-memory draft', () => {
    const draft = createPostDraftFromState({
      description: 'Draft caption',
      photos: [createPhoto('photo-1')],
      selectedPhotoId: 'photo-1',
      step: 'publication',
    })

    saveCreatePostDraft(draft)

    expect(getCreatePostDraft()).toEqual(draft)
  })

  it('stores photo editing state without preview object urls', () => {
    const draft = createPostDraftFromState({
      description: '',
      photos: [createPhoto('photo-1')],
      selectedPhotoId: 'photo-1',
      step: 'filters',
    })

    expect(draft.photos[0]).toMatchObject({
      id: 'photo-1',
      aspectId: '4:5',
      crop: { x: 4, y: 8 },
      zoom: 1.4,
      croppedAreaPixels: { x: 1, y: 2, width: 320, height: 400 },
      imageSize: { width: 800, height: 1000 },
      filterId: 'clarendon',
    })
    expect('previewUrl' in draft.photos[0]).toBe(false)
  })

  it('clears a saved draft', () => {
    saveCreatePostDraft(
      createPostDraftFromState({
        description: 'Draft caption',
        photos: [createPhoto('photo-1')],
        selectedPhotoId: 'photo-1',
        step: 'crop',
      })
    )

    clearCreatePostDraft()

    expect(getCreatePostDraft()).toBeNull()
  })
})

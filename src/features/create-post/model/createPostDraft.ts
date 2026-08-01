import type { CreatePostPhotoPreviewSource } from '../lib/createImagePreview'
import type { CreatePostPhoto } from './createPostFile'
import type { CreatePostStep } from './createPostFlow'

export type CreatePostDraft = {
  description: string
  photos: CreatePostPhotoPreviewSource[]
  selectedPhotoId: string | null
  step: CreatePostStep
}

let createPostDraft: CreatePostDraft | null = null

export const createPostDraftFromState = ({
  description,
  photos,
  selectedPhotoId,
  step,
}: {
  description: string
  photos: CreatePostPhoto[]
  selectedPhotoId: string | null
  step: CreatePostStep
}): CreatePostDraft => ({
  description,
  photos: photos.map((photo) => ({
    aspectId: photo.aspectId,
    crop: { ...photo.crop },
    croppedAreaPixels: photo.croppedAreaPixels ? { ...photo.croppedAreaPixels } : null,
    file: photo.file,
    filterId: photo.filterId,
    id: photo.id,
    imageSize: photo.imageSize ? { ...photo.imageSize } : null,
    zoom: photo.zoom,
  })),
  selectedPhotoId,
  step,
})

export const getCreatePostDraft = () => createPostDraft

export const saveCreatePostDraft = (draft: CreatePostDraft) => {
  createPostDraft = draft
}

export const clearCreatePostDraft = () => {
  createPostDraft = null
}

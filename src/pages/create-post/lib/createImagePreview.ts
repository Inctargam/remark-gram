import type { CreatePostPhoto } from '../model/createPostFile'

export const createImagePreview = (file: File): CreatePostPhoto => ({
  id: crypto.randomUUID(),
  file,
  previewUrl: URL.createObjectURL(file),
})

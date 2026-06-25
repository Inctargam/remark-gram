import {
  DEFAULT_CREATE_POST_ASPECT_ID,
  DEFAULT_CREATE_POST_CROP,
  DEFAULT_CREATE_POST_ZOOM,
} from '../model/createPostCrop'
import type { CreatePostPhoto } from '../model/createPostFile'

export const createImagePreview = (file: File): CreatePostPhoto => ({
  id: crypto.randomUUID(),
  file,
  previewUrl: URL.createObjectURL(file),
  crop: { ...DEFAULT_CREATE_POST_CROP },
  zoom: DEFAULT_CREATE_POST_ZOOM,
  aspectId: DEFAULT_CREATE_POST_ASPECT_ID,
  croppedAreaPixels: null,
})

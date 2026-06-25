export const CREATE_POST_ASPECTS = [
  { id: '1:1', label: '1:1', value: 1 },
  { id: '4:5', label: '4:5', value: 4 / 5 },
  { id: '16:9', label: '16:9', value: 16 / 9 },
] as const

export type CreatePostAspectId = (typeof CREATE_POST_ASPECTS)[number]['id']

export type CreatePostPoint = {
  x: number
  y: number
}

export type CreatePostCropArea = {
  width: number
  height: number
  x: number
  y: number
}

export const DEFAULT_CREATE_POST_ASPECT_ID: CreatePostAspectId = '1:1'
export const DEFAULT_CREATE_POST_CROP: CreatePostPoint = { x: 0, y: 0 }
export const DEFAULT_CREATE_POST_ZOOM = 1
export const MIN_CREATE_POST_ZOOM = 1
export const MAX_CREATE_POST_ZOOM = 3
export const CREATE_POST_ZOOM_STEP = 0.1

import type { CreatePostPhoto } from '../model/createPostFile'
import { getCreatePostFilterCss } from '../model/createPostFilter'

type ImageSource = {
  element: HTMLImageElement
  objectUrl: string
}

const loadImage = (file: File): Promise<ImageSource> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      resolve({ element: image, objectUrl })
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image for publication export'))
    }
    image.src = objectUrl
  })

const createCanvasBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to export publication image'))
          return
        }

        resolve(blob)
      },
      type,
      0.92
    )
  })

export const exportEditedImage = async (photo: CreatePostPhoto): Promise<File> => {
  const { element: image, objectUrl } = await loadImage(photo.file)
  const cropArea = photo.croppedAreaPixels ?? {
    height: image.naturalHeight,
    width: image.naturalWidth,
    x: 0,
    y: 0,
  }
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    URL.revokeObjectURL(objectUrl)
    throw new Error('Canvas is not available for publication export')
  }

  canvas.width = Math.round(cropArea.width)
  canvas.height = Math.round(cropArea.height)
  context.filter = getCreatePostFilterCss(photo.filterId)
  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  URL.revokeObjectURL(objectUrl)

  const blob = await createCanvasBlob(canvas, photo.file.type)

  return new File([blob], photo.file.name, { type: photo.file.type })
}

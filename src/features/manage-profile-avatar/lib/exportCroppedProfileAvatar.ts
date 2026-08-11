import type { Area } from 'react-easy-crop'

const loadImage = (file: File): Promise<{ image: HTMLImageElement; objectUrl: string }> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => resolve({ image, objectUrl })
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to prepare the profile photo.'))
    }
    image.src = objectUrl
  })

const createCanvasBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to prepare the profile photo.'))
          return
        }

        resolve(blob)
      },
      type,
      0.92
    )
  })

export const exportCroppedProfileAvatar = async (file: File, cropArea: Area) => {
  const { image, objectUrl } = await loadImage(file)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    URL.revokeObjectURL(objectUrl)
    throw new Error('Failed to prepare the profile photo.')
  }

  canvas.width = Math.max(1, Math.round(cropArea.width))
  canvas.height = Math.max(1, Math.round(cropArea.height))
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

  const blob = await createCanvasBlob(canvas, file.type)

  return new File([blob], file.name, { type: file.type })
}

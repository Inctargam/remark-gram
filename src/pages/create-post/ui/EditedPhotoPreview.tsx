import Image from 'next/image'
import type { CSSProperties } from 'react'

import { useEditedPhotoPreview } from '../lib/useEditedPhotoPreview'
import type { CreatePostPhoto } from '../model/createPostFile'
import styles from './createPostPage.module.css'

type Props = {
  alt: string
  photo: CreatePostPhoto
}

export const EditedPhotoPreview = ({ alt, photo }: Props) => {
  const cropArea = photo.croppedAreaPixels
  const imageSize = photo.imageSize
  const previewUrl = useEditedPhotoPreview(photo)
  const viewportStyle: CSSProperties =
    cropArea && imageSize
      ? {
          aspectRatio: `${cropArea.width} / ${cropArea.height}`,
          height: cropArea.height > cropArea.width ? '100%' : undefined,
          width: cropArea.width >= cropArea.height ? '100%' : undefined,
        }
      : { height: '100%', width: '100%' }

  return (
    <div className={styles.editedPreviewViewport} style={viewportStyle}>
      {previewUrl && (
        <Image
          className={styles.editedPreviewImage}
          src={previewUrl}
          alt={alt}
          width={Math.round(cropArea?.width ?? imageSize?.width ?? 492)}
          height={Math.round(cropArea?.height ?? imageSize?.height ?? 492)}
          unoptimized
        />
      )}
    </div>
  )
}

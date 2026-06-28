import Image from 'next/image'
import type { CSSProperties } from 'react'

import type { CreatePostPhoto } from '../model/createPostFile'
import { getCreatePostFilterCss } from '../model/createPostFilter'
import styles from './createPostPage.module.css'

type Props = {
  alt: string
  photo: CreatePostPhoto
}

export const EditedPhotoPreview = ({ alt, photo }: Props) => {
  const cropArea = photo.croppedAreaPixels
  const imageSize = photo.imageSize
  const filterCss = getCreatePostFilterCss(photo.filterId)
  const hasCropPreview = Boolean(cropArea && imageSize)
  const viewportStyle: CSSProperties =
    cropArea && imageSize
      ? {
          aspectRatio: `${cropArea.width} / ${cropArea.height}`,
          height: cropArea.height > cropArea.width ? '100%' : undefined,
          width: cropArea.width >= cropArea.height ? '100%' : undefined,
        }
      : { height: '100%', width: '100%' }
  const imageStyle: CSSProperties | undefined =
    cropArea && imageSize
      ? {
          filter: filterCss,
          height: `${(imageSize.height / cropArea.height) * 100}%`,
          left: `${(-cropArea.x / cropArea.width) * 100}%`,
          top: `${(-cropArea.y / cropArea.height) * 100}%`,
          width: `${(imageSize.width / cropArea.width) * 100}%`,
        }
      : { filter: filterCss }

  return (
    <div className={styles.editedPreviewViewport} style={viewportStyle}>
      <Image
        className={hasCropPreview ? styles.editedPreviewImageCropped : styles.editedPreviewImage}
        src={photo.previewUrl}
        alt={alt}
        width={492}
        height={492}
        style={imageStyle}
        unoptimized
      />
    </div>
  )
}

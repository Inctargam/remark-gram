import { useEffect, useState } from 'react'

import type { CreatePostPhoto } from '../model/createPostFile'
import { exportEditedImage } from './exportEditedImage'

type EditedPhotoPreview = {
  photo: CreatePostPhoto
  url: string
}

export const useEditedPhotoPreview = (photo: CreatePostPhoto) => {
  const [editedPreview, setEditedPreview] = useState<EditedPhotoPreview | null>(null)

  useEffect(() => {
    let isActive = true
    let previewUrl: string | null = null

    const createPreview = async () => {
      try {
        const { file } = await exportEditedImage(photo)

        if (!isActive) {
          return
        }

        previewUrl = URL.createObjectURL(file)
        setEditedPreview({ photo, url: previewUrl })
      } catch {
        return
      }
    }

    void createPreview()

    return () => {
      isActive = false

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [photo])

  return editedPreview?.photo === photo ? editedPreview.url : null
}

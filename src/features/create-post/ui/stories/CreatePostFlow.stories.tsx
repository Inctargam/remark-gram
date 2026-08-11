import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect, useRef, useState } from 'react'
import { expect, waitFor, within } from 'storybook/test'

import type {
  CreatePostAspectId,
  CreatePostCropArea,
  CreatePostImageSize,
  CreatePostPoint,
} from '../../model/createPostCrop'
import type { CreatePostPhoto } from '../../model/createPostFile'
import { CREATE_POST_FILE_ERROR } from '../../model/createPostFile'
import type { CreatePostFilterId } from '../../model/createPostFilter'
import type { CreatePostStep } from '../../model/createPostFlow'
import { CreatePostModal } from '../CreatePostModal'

type StoryState = {
  description?: string
  photosCount?: 1 | 3
  step: CreatePostStep
  uploadError?: string | null
}

const PHOTO_DATA_URLS = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVR42mP8z8DwnwEJMDBgAMQMAAc4AQL86AHFAAAAAElFTkSuQmCC',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR42mP8z8BQz0AEYBxVSFUBAAtsARUup6ZfAAAAAElFTkSuQmCC',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVR42mP8z8BQz0AEYBxVSBVAAAtpARWRzueQAAAAAElFTkSuQmCC',
] as const

const dataUrlToFile = (dataUrl: string, name: string) => {
  const [metadata, content] = dataUrl.split(',')
  const mimeType = metadata.match(/data:(.*);base64/)?.[1] ?? 'image/png'
  const binary = atob(content)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], name, { type: mimeType })
}

const createStoryPhoto = (index: number): CreatePostPhoto => {
  const file = dataUrlToFile(PHOTO_DATA_URLS[index], `publication-${index + 1}.png`)

  return {
    id: `story-photo-${index + 1}`,
    file,
    previewUrl: URL.createObjectURL(file),
    crop: { x: 0, y: 0 },
    zoom: index === 1 ? 1.3 : 1,
    aspectId: index === 2 ? '16:9' : 'original',
    croppedAreaPixels: { x: 0, y: 0, width: 2, height: 2 },
    imageSize: { width: 2, height: 2 },
    filterId: index === 1 ? 'clarendon' : 'original',
  }
}

const CreatePostFlowStory = ({
  description: initialDescription = '',
  photosCount = 1,
  step,
  uploadError = null,
}: StoryState) => {
  const [photos, setPhotos] = useState(() =>
    Array.from({ length: photosCount }, (_item, index) => createStoryPhoto(index))
  )
  const [selectedPhotoId, setSelectedPhotoId] = useState(photos[0]?.id ?? null)
  const [description, setDescription] = useState(initialDescription)
  const photosRef = useRef(photos)
  const selectedPhoto = photos.find(({ id }) => id === selectedPhotoId) ?? photos[0] ?? null

  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  useEffect(
    () => () => {
      photosRef.current.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl))
    },
    []
  )

  const updateSelectedPhotoHandler = (updatePhoto: (photo: CreatePostPhoto) => CreatePostPhoto) => {
    if (!selectedPhoto) {
      return
    }

    setPhotos((currentPhotos) =>
      currentPhotos.map((photo) => (photo.id === selectedPhoto.id ? updatePhoto(photo) : photo))
    )
  }

  const aspectChangeHandler = (aspectId: CreatePostAspectId) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, aspectId }))
  }

  const cropChangeHandler = (crop: CreatePostPoint) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, crop }))
  }

  const cropCompleteHandler = (croppedAreaPixels: CreatePostCropArea) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, croppedAreaPixels }))
  }

  const filterChangeHandler = (filterId: CreatePostFilterId) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, filterId }))
  }

  const imageSizeChangeHandler = (imageSize: CreatePostImageSize) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, imageSize }))
  }

  const zoomChangeHandler = (zoom: number) => {
    updateSelectedPhotoHandler((photo) => ({ ...photo, zoom }))
  }

  return (
    <CreatePostModal
      open
      description={description}
      hasDraft={step === 'add-photo'}
      isPublishing={false}
      photos={step === 'add-photo' ? [] : photos}
      publishError={null}
      selectedPhoto={step === 'add-photo' ? null : selectedPhoto}
      selectedPhotoId={step === 'add-photo' ? null : selectedPhotoId}
      step={step}
      uploadError={uploadError}
      onAspectChange={aspectChangeHandler}
      onBackToCrop={() => undefined}
      onBackToFilters={() => undefined}
      onCropChange={cropChangeHandler}
      onCropComplete={cropCompleteHandler}
      onDescriptionChange={setDescription}
      onDraftOpen={() => undefined}
      onFilterChange={filterChangeHandler}
      onImageSizeChange={imageSizeChangeHandler}
      onNextFromCrop={() => undefined}
      onNextFromFilters={() => undefined}
      onOpenChange={() => undefined}
      onPhotoSelect={setSelectedPhotoId}
      onPhotosSelect={() => undefined}
      onPublish={() => undefined}
      onZoomChange={zoomChangeHandler}
    />
  )
}

const meta = {
  title: 'features/CreatePostFlow',
  component: CreatePostModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/create',
      },
    },
    docs: {
      story: {
        iframeHeight: 760,
        inline: false,
      },
    },
  },
} satisfies Meta<typeof CreatePostModal>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyAddPhoto: Story = {
  render: () => <CreatePostFlowStory step="add-photo" />,
}

export const ValidationError: Story = {
  render: () => <CreatePostFlowStory step="add-photo" uploadError={CREATE_POST_FILE_ERROR} />,
}

export const CropWithOnePhoto: Story = {
  render: () => <CreatePostFlowStory step="crop" photosCount={1} />,
}

export const CropWithSeveralPhotos: Story = {
  render: () => <CreatePostFlowStory step="crop" photosCount={3} />,
}

export const CropOnShortMobile: Story = {
  globals: {
    viewport: {
      value: '360-740',
      isRotated: false,
    },
  },
  render: () => <CreatePostFlowStory step="crop" photosCount={1} />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument
    const documentCanvas = within(ownerDocument.body)
    const viewportHeight = ownerDocument.defaultView?.innerHeight ?? 740
    const dialog = documentCanvas.getByRole('dialog')
    const dialogBounds = dialog.getBoundingClientRect()
    const nextButton = documentCanvas.getByRole('button', { name: 'Next' })

    await expect(dialogBounds.top).toBeGreaterThanOrEqual(0)
    await expect(dialogBounds.bottom).toBeLessThanOrEqual(viewportHeight)

    nextButton.scrollIntoView({ block: 'nearest' })

    await waitFor(() => {
      const nextButtonBounds = nextButton.getBoundingClientRect()

      expect(nextButtonBounds.top).toBeGreaterThanOrEqual(dialogBounds.top)
      expect(nextButtonBounds.bottom).toBeLessThanOrEqual(dialogBounds.bottom)
    })
  },
}

export const Filters: Story = {
  render: () => <CreatePostFlowStory step="filters" photosCount={3} />,
}

export const Publication: Story = {
  render: () => (
    <CreatePostFlowStory
      step="publication"
      photosCount={3}
      description="A short publication description"
    />
  ),
}

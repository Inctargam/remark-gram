import { ApiError } from '@/shared/api/baseApi'
import { apiClient } from '@/shared/api/openapi'
import type {
  SchemaCreatePostDto,
  SchemaImageUploadMetadataDto,
  SchemaImageUploadSessionDto,
} from '@/shared/api/openapi/schema'
import { refreshSession, sessionStore } from '@/shared/auth'

import type { PublishPostPayload, PublishPostResult } from './publishPostTypes'

type PreparedPhotoUpload = {
  clientFileId: string
  file: File
}

const SUPPORTED_CONTENT_TYPES = ['image/jpeg', 'image/png'] as const

const createAbortError = () => new DOMException('Post publication was aborted', 'AbortError')

export const isPublishPostAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError'

const throwIfAborted = (signal?: AbortSignal) => {
  if (signal?.aborted) {
    throw createAbortError()
  }
}

const createAbortableFetch =
  (signal?: AbortSignal): typeof fetch =>
  (input, init) =>
    fetch(input, { ...init, signal })

const isSupportedContentType = (
  contentType: string
): contentType is SchemaImageUploadMetadataDto['contentType'] =>
  SUPPORTED_CONTENT_TYPES.some((supportedContentType) => supportedContentType === contentType)

const getApiErrorMessage = (error: unknown): string | null => {
  if (!error || typeof error !== 'object' || !('message' in error)) {
    return null
  }

  const message = (error as { message?: unknown }).message

  if (Array.isArray(message)) {
    return message.join(', ')
  }

  return typeof message === 'string' ? message : null
}

const getApiErrorCode = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return undefined
  }

  const code = (error as { code?: unknown }).code

  return typeof code === 'string' ? code : undefined
}

const getApiErrorData = (error: unknown, fallbackMessage: string) => ({
  code: getApiErrorCode(error),
  message: getApiErrorMessage(error) ?? fallbackMessage,
})

const ensureCreatePostAccessToken = async (): Promise<void> => {
  if (sessionStore.getState().accessToken) {
    return
  }

  const refreshedAccessToken = await refreshSession()

  if (!refreshedAccessToken) {
    throw new ApiError(401, { message: 'Invalid access token' })
  }
}

const createUploadMetadata = ({
  clientFileId,
  file,
}: PreparedPhotoUpload): SchemaImageUploadMetadataDto => {
  if (!isSupportedContentType(file.type)) {
    throw new Error(`Unsupported image content type: ${file.type}`)
  }

  return {
    clientFileId,
    originalFilename: file.name,
    contentType: file.type,
    size: file.size,
  }
}

const createPresignedUploadFormData = (session: SchemaImageUploadSessionDto, file: File) => {
  const formData = new FormData()

  Object.entries(session.fields).forEach(([fieldName, fieldValue]) => {
    formData.append(fieldName, fieldValue)
  })
  formData.append('file', file)

  return formData
}

const uploadPhotoToObjectStorage = async (
  session: SchemaImageUploadSessionDto,
  file: File,
  signal?: AbortSignal
): Promise<void> => {
  throwIfAborted(signal)

  const response = await fetch(session.url, {
    method: 'POST',
    body: createPresignedUploadFormData(session, file),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Image upload failed with ${response.status}`)
  }
}

const initiateImageUploads = async (photos: PreparedPhotoUpload[], signal?: AbortSignal) => {
  throwIfAborted(signal)

  const { data, error, response } = await apiClient.POST('/api/v1/files/image-uploads', {
    body: {
      images: photos.map(createUploadMetadata),
    },
    fetch: createAbortableFetch(signal),
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      getApiErrorData(error, `Image upload initialization failed with ${response.status}`)
    )
  }

  if (!data?.sessions || data.sessions.length !== photos.length) {
    throw new Error('Image upload initialization response does not match selected photos')
  }

  return data.sessions
}

const completeImageUploads = async (uploadIds: string[], signal?: AbortSignal): Promise<void> => {
  throwIfAborted(signal)

  const { error, response } = await apiClient.POST('/api/v1/files/image-uploads/complete', {
    body: { uploadIds },
    fetch: createAbortableFetch(signal),
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      getApiErrorData(error, `Image upload confirmation failed with ${response.status}`)
    )
  }
}

const createPost = async (
  payload: SchemaCreatePostDto,
  signal?: AbortSignal
): Promise<PublishPostResult> => {
  throwIfAborted(signal)

  const { data, error, response } = await apiClient.POST('/api/v1/posts', {
    body: payload,
    fetch: createAbortableFetch(signal),
    headers: { 'Idempotency-Key': crypto.randomUUID() },
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      getApiErrorData(error, `Post publication failed with ${response.status}`)
    )
  }

  if (!data) {
    throw new Error('Post publication response does not contain a publication id')
  }

  return { publicationId: String(data.id) }
}

export const publishPostApi = async (
  { description, photos }: PublishPostPayload,
  signal?: AbortSignal
): Promise<PublishPostResult> => {
  throwIfAborted(signal)
  await ensureCreatePostAccessToken()
  throwIfAborted(signal)

  const preparedPhotos = photos.map(({ file }) => ({
    clientFileId: crypto.randomUUID(),
    file,
  }))
  const sessions = await initiateImageUploads(preparedPhotos, signal)
  const photosByClientFileId = new Map(
    preparedPhotos.map(({ clientFileId, file }) => [clientFileId, file])
  )

  await Promise.all(
    sessions.map((session) => {
      const file = photosByClientFileId.get(session.clientFileId)

      if (!file) {
        throw new Error(
          `Image upload session does not match a selected photo: ${session.clientFileId}`
        )
      }

      return uploadPhotoToObjectStorage(session, file, signal)
    })
  )

  const imageIds = sessions.map((session) => session.id)

  await completeImageUploads(imageIds, signal)

  return createPost(
    {
      description,
      imageIds,
    },
    signal
  )
}

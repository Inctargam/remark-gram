import { apiClient } from '@/shared/api/openapi'

import { PROFILE_AVATAR_FILE_ERROR, validateProfileAvatar } from '../model/profileAvatarFile'

export class ProfileAvatarRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'ProfileAvatarRequestError'
  }
}

const checkResponse = (response: Response, error: unknown) => {
  if (response.ok) {
    return
  }
  const message = error && typeof error === 'object' && 'message' in error ? error.message : null
  const fallback =
    response.status === 409
      ? 'Another avatar update is in progress or the file is unavailable. Please try again later.'
      : `Failed to update profile photo (${response.status}). Please try again.`
  throw new ProfileAvatarRequestError(
    response.status,
    typeof message === 'string' ? message : Array.isArray(message) ? message.join('; ') : fallback
  )
}

export const initiateAvatarUpload = async (file: File, clientFileId: string) => {
  if (!validateProfileAvatar(file)) {
    throw new Error(PROFILE_AVATAR_FILE_ERROR)
  }
  const { data, error, response } = await apiClient.POST('/api/v1/files/avatar-upload', {
    body: {
      clientFileId,
      originalFilename: file.name,
      contentType: file.type as 'image/jpeg' | 'image/png',
      size: file.size,
    },
  })
  checkResponse(response, error)
  if (!data) {
    throw new Error('Failed to obtain upload parameters.')
  }
  return data
}

export const uploadAvatarFile = async (file: File, url: string, fields: Record<string, string>) => {
  const form = new FormData()
  Object.entries(fields).forEach(([name, value]) => form.append(name, value))
  form.append('file', file)
  const response = await fetch(url, { method: 'POST', body: form, credentials: 'omit' })
  checkResponse(response, null)
}

export const completeAvatarUpload = async (fileId: string) => {
  const { response, error } = await apiClient.POST('/api/v1/files/image-uploads/complete', {
    body: { uploadIds: [fileId] },
  })
  checkResponse(response, error)
}

export const setProfileAvatar = async (fileId: string, idempotencyKey: string) => {
  const { response, error } = await apiClient.PUT('/api/v1/users/me/profile/avatar', {
    params: { header: { 'Idempotency-Key': idempotencyKey } },
    body: { fileId },
  })
  checkResponse(response, error)
}

export const deleteProfileAvatar = async (idempotencyKey: string) => {
  const { response, error } = await apiClient.DELETE('/api/v1/users/me/profile/avatar', {
    params: { header: { 'Idempotency-Key': idempotencyKey } },
  })
  checkResponse(response, error)
}

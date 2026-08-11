import { isValidJpegOrPngImage } from '@/shared/lib/image-file'

import {
  deleteMockProfileAvatar,
  getMockProfileAvatarFile,
  updateMockProfileAvatar,
} from './profileStore'

const MAX_PROFILE_PHOTO_SIZE_BYTES = 10 * 1024 * 1024
const INVALID_PROFILE_PHOTO_ERROR = 'The photo must be less than 10 Mb and have JPEG or PNG format'

const invalidPhotoResponse = () =>
  Response.json({ message: INVALID_PROFILE_PHOTO_ERROR }, { status: 400 })

export const uploadProfileAvatarHandler = async (request: Request) => {
  const formData = await request.formData().catch(() => null)
  const file = formData?.get('file')

  if (!(file instanceof File) || !isValidJpegOrPngImage(file, MAX_PROFILE_PHOTO_SIZE_BYTES)) {
    return invalidPhotoResponse()
  }

  const avatars = updateMockProfileAvatar({
    bytes: new Uint8Array(await file.arrayBuffer()),
    contentType: file.type,
    fileSize: file.size,
  })

  return Response.json({ avatars })
}

export const deleteProfileAvatarHandler = async () => {
  return Response.json({ avatars: deleteMockProfileAvatar() })
}

export const getProfileAvatarImageHandler = async () => {
  const avatarFile = getMockProfileAvatarFile()

  if (!avatarFile) {
    return Response.json({ message: 'Profile photo was not found.' }, { status: 404 })
  }

  const imageBytes = new Uint8Array(avatarFile.bytes.byteLength)

  imageBytes.set(avatarFile.bytes)

  return new Response(new Blob([imageBytes.buffer], { type: avatarFile.contentType }), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': avatarFile.contentType,
    },
  })
}

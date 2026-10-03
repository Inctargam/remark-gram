import type { SchemaImageUploadSessionDto } from '@/shared/api/openapi/schema'

import {
  completeAvatarUpload,
  initiateAvatarUpload,
  uploadAvatarFile,
} from '../api/profileAvatarApi'

export type AvatarChangeOperation = {
  idempotencyKey: string
  applied: boolean
  reconciliationRequired: boolean
  retryWithNewKey: boolean
}
export type AvatarUploadOperation = AvatarChangeOperation & {
  file: File
  clientFileId: string
  session?: SchemaImageUploadSessionDto
  uploaded: boolean
  completed: boolean
}
export const createAvatarChangeOperation = (): AvatarChangeOperation => ({
  idempotencyKey: crypto.randomUUID(),
  applied: false,
  reconciliationRequired: false,
  retryWithNewKey: false,
})
export const createAvatarUploadOperation = (file: File): AvatarUploadOperation => ({
  ...createAvatarChangeOperation(),
  file,
  clientFileId: crypto.randomUUID(),
  uploaded: false,
  completed: false,
})
export const prepareAvatarUpload = async (operation: AvatarUploadOperation) => {
  operation.session ??= await initiateAvatarUpload(operation.file, operation.clientFileId)
  if (!operation.uploaded) {
    await uploadAvatarFile(operation.file, operation.session.url, operation.session.fields)
    operation.uploaded = true
  }
  if (!operation.completed) {
    await completeAvatarUpload(operation.session.id)
    operation.completed = true
  }
  return operation.session.id
}

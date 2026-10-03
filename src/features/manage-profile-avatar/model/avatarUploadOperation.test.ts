import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  completeAvatarUpload,
  initiateAvatarUpload,
  uploadAvatarFile,
} from '../api/profileAvatarApi'
import { createAvatarUploadOperation, prepareAvatarUpload } from './avatarUploadOperation'
vi.mock('../api/profileAvatarApi', () => ({
  initiateAvatarUpload: vi.fn(),
  uploadAvatarFile: vi.fn(),
  completeAvatarUpload: vi.fn(),
}))
beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(initiateAvatarUpload).mockResolvedValue({
    id: 'server-id',
    clientFileId: 'client',
    url: 'https://storage.example.com',
    fields: {},
  })
  vi.mocked(uploadAvatarFile).mockResolvedValue()
  vi.mocked(completeAvatarUpload).mockResolvedValue()
})
const createOperation = () =>
  createAvatarUploadOperation(new File(['image'], 'avatar.png', { type: 'image/png' }))
describe('resumable avatar upload', () => {
  it('resumes confirmation without uploading the file again', async () => {
    const operation = createOperation()
    vi.mocked(completeAvatarUpload).mockRejectedValueOnce(new Error('offline'))
    await expect(prepareAvatarUpload(operation)).rejects.toThrow('offline')
    await expect(prepareAvatarUpload(operation)).resolves.toBe('server-id')
    expect(initiateAvatarUpload).toHaveBeenCalledTimes(1)
    expect(uploadAvatarFile).toHaveBeenCalledTimes(1)
    expect(completeAvatarUpload).toHaveBeenCalledTimes(2)
  })
  it('resumes storage upload with the same signed session', async () => {
    const operation = createOperation()
    vi.mocked(uploadAvatarFile).mockRejectedValueOnce(new Error('offline'))
    await expect(prepareAvatarUpload(operation)).rejects.toThrow()
    await prepareAvatarUpload(operation)
    expect(initiateAvatarUpload).toHaveBeenCalledTimes(1)
    expect(uploadAvatarFile).toHaveBeenCalledTimes(2)
    expect(completeAvatarUpload).toHaveBeenCalledTimes(1)
  })
  it('does not repeat completed steps when retrying installation', async () => {
    const operation = createOperation()
    await prepareAvatarUpload(operation)
    await prepareAvatarUpload(operation)
    expect(uploadAvatarFile).toHaveBeenCalledTimes(1)
    expect(completeAvatarUpload).toHaveBeenCalledTimes(1)
  })
  it('assigns new ids to a new cropped file operation', () => {
    const first = createOperation()
    const second = createOperation()
    expect(first.clientFileId).not.toBe(second.clientFileId)
    expect(first.idempotencyKey).not.toBe(second.idempotencyKey)
  })
})

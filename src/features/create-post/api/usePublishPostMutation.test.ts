import { beforeEach, describe, expect, it, vi } from 'vitest'

import { postsQueryKeys } from '@/entities/post'

import type { PublishPostPayload, PublishPostResult } from './publishPostTypes'
import { usePublishPostMutation } from './usePublishPostMutation'

const mocks = vi.hoisted(() => ({
  invalidateQueries: vi.fn(),
  publishPostApi: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useMutation: mocks.useMutation,
  useQueryClient: mocks.useQueryClient,
}))

vi.mock('./publishPostApi', () => ({
  publishPostApi: mocks.publishPostApi,
}))

type MutationOptions = {
  mutationFn: (payload: PublishPostPayload) => Promise<PublishPostResult>
  onSuccess: () => unknown
}

const photo = {
  file: new File(['photo'], 'photo.jpg', { type: 'image/jpeg' }),
  height: 720,
  width: 1080,
}

beforeEach(() => {
  mocks.invalidateQueries.mockReset()
  mocks.publishPostApi.mockReset()
  mocks.useMutation.mockReset()
  mocks.useQueryClient.mockReset()
  mocks.useMutation.mockImplementation((options) => options)
  mocks.useQueryClient.mockReturnValue({ invalidateQueries: mocks.invalidateQueries })
})

describe('usePublishPostMutation', () => {
  it('publishes through the real API adapter and invalidates post lists', async () => {
    const payload = { description: 'caption', photos: [photo] }
    const publishedPost = { publicationId: '42' }

    mocks.publishPostApi.mockResolvedValue(publishedPost)

    const mutation = usePublishPostMutation() as unknown as MutationOptions

    await expect(mutation.mutationFn(payload)).resolves.toEqual(publishedPost)
    expect(mocks.publishPostApi).toHaveBeenCalledWith(payload)

    mutation.onSuccess()

    expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: postsQueryKeys.lists() })
  })
})

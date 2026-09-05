import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/baseApi'
import { apiClient } from '@/shared/api/openapi'
import { refreshSession, sessionStore } from '@/shared/auth'

import { publishPostApi } from './publishPostApi'

vi.mock('@/shared/api/openapi', () => ({
  apiClient: {
    POST: vi.fn(),
  },
}))

vi.mock('@/shared/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/auth')>()

  return {
    ...actual,
    refreshSession: vi.fn(),
  }
})

const apiPostMock = apiClient.POST as Mock
const fetchMock = vi.fn()
const randomUUIDMock = vi.fn()
const refreshSessionMock = vi.mocked(refreshSession)

const createResponse = (status: number) =>
  ({
    ok: status >= 200 && status < 300,
    status,
  }) as Response

const photo = {
  file: new File(['photo'], 'photo.jpg', { type: 'image/jpeg' }),
  width: 1080,
  height: 720,
}

beforeEach(() => {
  apiPostMock.mockReset()
  fetchMock.mockReset()
  randomUUIDMock.mockReset()
  refreshSessionMock.mockReset()
  sessionStore.getState().setAuthenticated('access-token')
  vi.stubGlobal('fetch', fetchMock)
  vi.stubGlobal('crypto', { randomUUID: randomUUIDMock })
})

afterEach(() => {
  vi.unstubAllGlobals()
  sessionStore.setState({ accessToken: null, currentUser: null, status: 'loading' })
})

describe('publishPostApi', () => {
  it('uploads edited photos, completes uploads and creates a post', async () => {
    randomUUIDMock
      .mockReturnValueOnce('11111111-1111-4111-8111-111111111111')
      .mockReturnValueOnce('22222222-2222-4222-8222-222222222222')
    apiPostMock
      .mockResolvedValueOnce({
        data: {
          sessions: [
            {
              id: '33333333-3333-4333-8333-333333333333',
              clientFileId: '11111111-1111-4111-8111-111111111111',
              url: 'https://storage.example.com',
              fields: {
                key: 'users/1/images/33333333-3333-4333-8333-333333333333',
                'Content-Type': 'image/jpeg',
              },
            },
          ],
        },
        error: undefined,
        response: createResponse(201),
      })
      .mockResolvedValueOnce({
        data: undefined,
        error: undefined,
        response: createResponse(204),
      })
      .mockResolvedValueOnce({
        data: { id: 42 },
        error: undefined,
        response: createResponse(201),
      })
    fetchMock.mockResolvedValue(createResponse(204))

    await expect(publishPostApi({ description: 'caption', photos: [photo] })).resolves.toEqual({
      publicationId: '42',
    })

    expect(apiPostMock).toHaveBeenNthCalledWith(1, '/api/v1/files/image-uploads', {
      body: {
        images: [
          {
            clientFileId: '11111111-1111-4111-8111-111111111111',
            originalFilename: 'photo.jpg',
            contentType: 'image/jpeg',
            size: photo.file.size,
          },
        ],
      },
      fetch: expect.any(Function),
    })
    expect(fetchMock).toHaveBeenCalledWith('https://storage.example.com', {
      method: 'POST',
      body: expect.any(FormData),
      signal: undefined,
    })
    expect(apiPostMock).toHaveBeenNthCalledWith(2, '/api/v1/files/image-uploads/complete', {
      body: { uploadIds: ['33333333-3333-4333-8333-333333333333'] },
      fetch: expect.any(Function),
    })
    expect(apiPostMock).toHaveBeenNthCalledWith(3, '/api/v1/posts', {
      body: {
        description: 'caption',
        imageIds: ['33333333-3333-4333-8333-333333333333'],
      },
      fetch: expect.any(Function),
      headers: { 'Idempotency-Key': '22222222-2222-4222-8222-222222222222' },
    })
  })

  it('does not start publication requests when already aborted', async () => {
    const abortController = new AbortController()

    abortController.abort()

    await expect(
      publishPostApi({ description: 'caption', photos: [photo] }, abortController.signal)
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(apiPostMock).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('passes the abort signal to presigned uploads', async () => {
    const abortController = new AbortController()

    randomUUIDMock.mockReturnValue('11111111-1111-4111-8111-111111111111')
    apiPostMock.mockResolvedValueOnce({
      data: {
        sessions: [
          {
            id: '33333333-3333-4333-8333-333333333333',
            clientFileId: '11111111-1111-4111-8111-111111111111',
            url: 'https://storage.example.com',
            fields: {},
          },
        ],
      },
      error: undefined,
      response: createResponse(201),
    })
    fetchMock.mockRejectedValue(new DOMException('Upload aborted', 'AbortError'))

    await expect(
      publishPostApi({ description: 'caption', photos: [photo] }, abortController.signal)
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(fetchMock).toHaveBeenCalledWith('https://storage.example.com', {
      method: 'POST',
      body: expect.any(FormData),
      signal: abortController.signal,
    })
  })

  it('throws ApiError with backend validation messages', async () => {
    randomUUIDMock.mockReturnValue('11111111-1111-4111-8111-111111111111')
    apiPostMock.mockResolvedValueOnce({
      data: undefined,
      error: {
        statusCode: 400,
        message: ['image count must be between 1 and 10'],
        error: 'Bad Request',
      },
      response: createResponse(400),
    })
    const publishPromise = publishPostApi({ description: 'caption', photos: [photo] })

    await expect(publishPromise).rejects.toThrow(ApiError)
    await expect(publishPromise).rejects.toThrow('image count must be between 1 and 10')
  })

  it('throws when a presigned upload fails', async () => {
    randomUUIDMock.mockReturnValue('11111111-1111-4111-8111-111111111111')
    apiPostMock.mockResolvedValueOnce({
      data: {
        sessions: [
          {
            id: '33333333-3333-4333-8333-333333333333',
            clientFileId: '11111111-1111-4111-8111-111111111111',
            url: 'https://storage.example.com',
            fields: {},
          },
        ],
      },
      error: undefined,
      response: createResponse(201),
    })
    fetchMock.mockResolvedValue(createResponse(403))

    await expect(publishPostApi({ description: 'caption', photos: [photo] })).rejects.toThrow(
      'Image upload failed with 403'
    )
  })

  it('refreshes the session before publishing when the access token is missing', async () => {
    sessionStore.getState().setGuest()
    refreshSessionMock.mockResolvedValue('refreshed-token')
    randomUUIDMock
      .mockReturnValueOnce('11111111-1111-4111-8111-111111111111')
      .mockReturnValueOnce('22222222-2222-4222-8222-222222222222')
    apiPostMock
      .mockResolvedValueOnce({
        data: {
          sessions: [
            {
              id: '33333333-3333-4333-8333-333333333333',
              clientFileId: '11111111-1111-4111-8111-111111111111',
              url: 'https://storage.example.com',
              fields: {},
            },
          ],
        },
        error: undefined,
        response: createResponse(201),
      })
      .mockResolvedValueOnce({
        data: undefined,
        error: undefined,
        response: createResponse(204),
      })
      .mockResolvedValueOnce({
        data: { id: 42 },
        error: undefined,
        response: createResponse(201),
      })
    fetchMock.mockResolvedValue(createResponse(204))

    await expect(publishPostApi({ description: 'caption', photos: [photo] })).resolves.toEqual({
      publicationId: '42',
    })
    expect(refreshSessionMock).toHaveBeenCalledOnce()
  })

  it('throws an authorization error when the missing access token cannot be refreshed', async () => {
    sessionStore.getState().setGuest()
    refreshSessionMock.mockResolvedValue(null)

    await expect(publishPostApi({ description: 'caption', photos: [photo] })).rejects.toThrow(
      ApiError
    )
    expect(apiPostMock).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

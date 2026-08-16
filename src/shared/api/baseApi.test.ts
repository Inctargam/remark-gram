import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/config', () => ({ API_BASE_URL: 'https://backend.example.com/api' }))

const { api, ApiError } = await import('./baseApi')

const fetchMock = vi.fn()

const getRequestedUrl = () => String(fetchMock.mock.calls[0]?.[0])
const getRequestInit = () => fetchMock.mock.calls[0]?.[1] as RequestInit

beforeEach(() => {
  fetchMock.mockResolvedValue(new Response('{}', { status: 200 }))
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('api', () => {
  it('prefixes a path with the API base url by default', async () => {
    await api.get('/v1/posts')

    expect(getRequestedUrl()).toBe('https://backend.example.com/api/v1/posts')
  })

  it('keeps the request on the current origin when the base url is empty', async () => {
    await api.get('/api/mock/posts', { baseUrl: '' })

    expect(getRequestedUrl()).toBe('/api/mock/posts')
  })

  // `baseUrl` is ours, not a `fetch` option — it must be stripped before the request is sent.
  it('does not pass the base url down to fetch', async () => {
    await api.post('/api/mock/posts', { description: 'text' }, { baseUrl: '' })

    expect(getRequestInit()).not.toHaveProperty('baseUrl')
    expect(getRequestInit().method).toBe('POST')
  })

  it('declares the content type only for requests that carry a body', async () => {
    await api.post('/api/mock/posts', { description: 'text' }, { baseUrl: '' })

    expect(getRequestInit().headers).toEqual({ 'Content-Type': 'application/json' })
  })

  it('sends a JSON body with PUT requests', async () => {
    await api.put('/api/v1/profile', { userName: 'user123' }, { baseUrl: '' })

    expect(getRequestInit().method).toBe('PUT')
    expect(getRequestInit().body).toBe(JSON.stringify({ userName: 'user123' }))
  })

  it('lets the browser declare the multipart boundary for FormData requests', async () => {
    const formData = new FormData()
    formData.append('file', new Blob(['photo'], { type: 'image/png' }), 'photo.png')

    await api.postForm('/api/v1/profile/avatar', formData, { baseUrl: '' })

    expect(getRequestInit().headers).toEqual({})
    expect(getRequestInit().body).toBe(formData)
  })

  it('sends no content type on a request without a body', async () => {
    await api.delete('/api/mock/posts/post-1', { baseUrl: '' })

    expect(getRequestInit().headers).toEqual({})
  })
})

describe('ApiError', () => {
  it('keeps a string message as is', () => {
    const error = new ApiError(401, { message: 'Unauthorized' })

    expect(error.message).toBe('Unauthorized')
    expect(error.name).toBe('ApiError')
    expect(error.status).toBe(401)
  })

  it('joins a string[] message into a single string', () => {
    const error = new ApiError(400, { message: ['email must be an email', 'password is required'] })

    expect(error.message).toBe('email must be an email, password is required')
  })

  it('falls back to a status-based message when there is no body', () => {
    const error = new ApiError(500, null)

    expect(error.message).toBe('API error 500')
  })
})

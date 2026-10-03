import { afterEach, describe, expect, it, vi } from 'vitest'

import { sessionStore } from '@/shared/auth/sessionStore'

import {
  completeAvatarUpload,
  deleteProfileAvatar,
  initiateAvatarUpload,
  setProfileAvatar,
  uploadAvatarFile,
} from './profileAvatarApi'
vi.mock('@/shared/config', () => ({ API_BASE_URL: 'https://backend.example.com' }))
afterEach(() => {
  vi.unstubAllGlobals()
  sessionStore.getState().setGuest()
})
const file = new File(['image'], 'avatar.png', { type: 'image/png' })
describe('backend avatar requests', () => {
  it('sends final file metadata and the access token', async () => {
    sessionStore.getState().setAuthenticated('access-token')
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json(
        {
          id: 'file-id',
          clientFileId: 'client-id',
          url: 'https://storage.example.com',
          fields: {},
        },
        { status: 201 }
      )
    )
    vi.stubGlobal('fetch', fetchMock)
    await initiateAvatarUpload(file, 'client-id')
    const request = fetchMock.mock.calls[0][0] as Request
    expect(request.url).toBe('https://backend.example.com/api/v1/files/avatar-upload')
    expect(request.headers.get('Authorization')).toBe('Bearer access-token')
    expect(await request.json()).toEqual({
      clientFileId: 'client-id',
      originalFilename: file.name,
      contentType: file.type,
      size: file.size,
    })
  })
  it('uploads signed fields unchanged with file last and no app credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    await uploadAvatarFile(file, 'https://storage.example.com', {
      key: 'signed-key',
      Policy: 'opaque',
    })
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://storage.example.com')
    expect(options.credentials).toBe('omit')
    expect(options.headers).toBeUndefined()
    expect(Array.from((options.body as FormData).keys())).toEqual(['key', 'Policy', 'file'])
    expect((options.body as FormData).get('Policy')).toBe('opaque')
  })
  it('confirms by server id and accepts 204 without JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    await completeAvatarUpload('file-id')
    expect(await (fetchMock.mock.calls[0][0] as Request).json()).toEqual({ uploadIds: ['file-id'] })
  })
  it('sends keys for both installation and deletion', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() => Promise.resolve(new Response(null, { status: 204 })))
    vi.stubGlobal('fetch', fetchMock)
    await setProfileAvatar('file-id', 'install-key')
    await deleteProfileAvatar('delete-key')
    const install = fetchMock.mock.calls[0][0] as Request
    const remove = fetchMock.mock.calls[1][0] as Request
    expect(install.headers.get('Idempotency-Key')).toBe('install-key')
    expect(await install.json()).toEqual({ fileId: 'file-id' })
    expect(remove.headers.get('Idempotency-Key')).toBe('delete-key')
    expect(await remove.text()).toBe('')
  })
  it('rejects oversized final files before any request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const oversized = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'avatar.png', {
      type: 'image/png',
    })
    await expect(initiateAvatarUpload(oversized, 'client')).rejects.toThrow('10 Mb')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

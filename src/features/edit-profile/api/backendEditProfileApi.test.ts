import { afterEach, describe, expect, it, vi } from 'vitest'

const { putMock } = vi.hoisted(() => ({ putMock: vi.fn() }))

vi.mock('@/shared/api/openapi', () => ({ apiClient: { PUT: putMock } }))

const { updateProfile } = await import('./editProfileApi')

const FORM_VALUES = {
  username: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: null,
  aboutMe: '',
  country: 'IT',
  city: 'Rome',
}

afterEach(() => putMock.mockReset())

describe('backend profile update', () => {
  it('sends the backend DTO and accepts a bodyless 204 response', async () => {
    putMock.mockResolvedValue({ response: { ok: true, status: 204 } })

    await expect(updateProfile(FORM_VALUES)).resolves.toBeUndefined()
    expect(putMock).toHaveBeenCalledWith('/api/v1/users/me/profile', {
      body: {
        username: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '',
        aboutMe: '',
        countryCode: 'IT',
        city: 'Rome',
      },
    })
  })

  it('reports backend validation messages', async () => {
    putMock.mockResolvedValue({
      error: { message: ['dateOfBirth must be a valid ISO 8601 date string'] },
      response: { ok: false, status: 400 },
    })

    await expect(updateProfile(FORM_VALUES)).rejects.toMatchObject({
      message: 'dateOfBirth must be a valid ISO 8601 date string',
      messages: ['dateOfBirth must be a valid ISO 8601 date string'],
      status: 400,
    })
  })

  it('preserves the username conflict status and code', async () => {
    putMock.mockResolvedValue({
      error: { code: 'USERNAME_ALREADY_EXISTS', message: 'Username already exists' },
      response: { ok: false, status: 409 },
    })

    await expect(updateProfile(FORM_VALUES)).rejects.toMatchObject({
      message: 'Username already exists',
      status: 409,
      code: 'USERNAME_ALREADY_EXISTS',
    })
  })
})

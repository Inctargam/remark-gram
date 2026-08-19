import { beforeEach, describe, expect, it } from 'vitest'

import { getProfileHandler, updateProfileHandler } from './profileHandler'
import { resetMockProfile } from './profileStore'

const VALID_UPDATE = {
  userName: 'updated-user',
  firstName: 'Анна',
  lastName: 'Иванова',
  city: 'Austin',
  country: 'United States',
  region: 'Texas',
  dateOfBirth: '1990-12-12',
  aboutMe: 'Updated profile',
}

const createPutRequest = (body: unknown) =>
  new Request('http://localhost/api/mock/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

beforeEach(() => {
  resetMockProfile()
})

describe('profile mock handlers', () => {
  it('returns the current profile', async () => {
    const response = await getProfileHandler()

    await expect(response.json()).resolves.toMatchObject({
      id: 1,
      userName: 'user123',
      region: 'Texas',
      avatars: [],
    })
  })

  it('updates editable fields and preserves server-owned fields', async () => {
    const response = await updateProfileHandler(createPutRequest(VALID_UPDATE))
    const profile = await response.json()

    expect(response.status).toBe(200)
    expect(profile).toMatchObject({
      ...VALID_UPDATE,
      id: 1,
      avatars: [],
    })
  })

  it('rejects an invalid username', async () => {
    const response = await updateProfileHandler(
      createPutRequest({ ...VALID_UPDATE, userName: 'bad name' })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ message: 'Profile data is invalid.' })
  })

  it('rejects a profile younger than thirteen', async () => {
    const response = await updateProfileHandler(
      createPutRequest({ ...VALID_UPDATE, dateOfBirth: '2999-01-01' })
    )

    expect(response.status).toBe(400)
  })
})

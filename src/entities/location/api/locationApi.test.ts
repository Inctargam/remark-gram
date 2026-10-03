import { afterEach, describe, expect, it, vi } from 'vitest'

import { getLocationCities } from './locationApi'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('location static assets API', () => {
  it('loads all cities with one country request', async () => {
    const cities = [{ id: '1', name: 'Minsk', region: 'Minsk Region' }]
    const fetchMock = vi.fn().mockResolvedValue(Response.json(cities))

    vi.stubGlobal('fetch', fetchMock)

    await expect(getLocationCities('BY')).resolves.toEqual(cities)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/locations/v1/cities/BY.json')
  })

  it('distinguishes a failed request from an empty result', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ message: 'Unavailable' }, { status: 500 }))
    )

    await expect(getLocationCities('BY')).rejects.toThrow('Failed to load cities')
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'

import { getLocationCities, getLocationCountries } from './locationApi'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('location static assets API', () => {
  it('loads the generated country list', async () => {
    const countries = [{ code: 'BY', name: 'Belarus' }]
    const fetchMock = vi.fn().mockResolvedValue(Response.json(countries))

    vi.stubGlobal('fetch', fetchMock)

    await expect(getLocationCountries()).resolves.toEqual(countries)
    expect(fetchMock).toHaveBeenCalledWith('/locations/v1/countries.json')
  })

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

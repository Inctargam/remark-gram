import { afterEach, describe, expect, it, vi } from 'vitest'

const { getMock } = vi.hoisted(() => ({ getMock: vi.fn() }))

vi.mock('@/shared/api/openapi', () => ({ apiClient: { GET: getMock } }))

const { getLocationCountries } = await import('./locationApi')

afterEach(() => getMock.mockReset())

describe('backend country search', () => {
  it('sends Italy as the backend search term and maps its English name', async () => {
    getMock.mockResolvedValue({
      data: [{ code: 'IT', name: { en: 'Italy', ru: 'Италия' } }],
      response: { ok: true, status: 200 },
    })

    await expect(getLocationCountries('Italy')).resolves.toEqual([{ code: 'IT', name: 'Italy' }])
    expect(getMock).toHaveBeenCalledWith('/api/v1/countries', {
      params: { query: { 'Search by term': 'Italy', Limit: 20 } },
      querySerializer: expect.any(Function),
    })
    const options = getMock.mock.calls[0][1]
    expect(options.querySerializer(options.params.query)).toBe('term=Italy&limit=20')
  })

  it('rejects a failed country lookup', async () => {
    getMock.mockResolvedValue({ data: undefined, response: { ok: false, status: 401 } })

    await expect(getLocationCountries()).rejects.toThrow('Failed to load countries (401)')
  })
})

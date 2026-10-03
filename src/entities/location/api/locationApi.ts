import type { LocationCity, LocationCountry } from '@/entities/location'
import { apiClient } from '@/shared/api/openapi'

const LOCATION_ASSETS_PATH = '/locations/v1'

export const getLocationCountries = async (term = ''): Promise<LocationCountry[]> => {
  const { data, response } = await apiClient.GET('/api/v1/countries', {
    params: { query: { 'Search by term': term, Limit: 20 } },
    // Swagger names these parameters as UI labels, while the endpoint reads term and limit.
    querySerializer: () => new URLSearchParams({ term, limit: '20' }).toString(),
  })

  if (!response.ok || !data) {
    throw new Error(`Failed to load countries (${response.status})`)
  }

  return data.map(({ code, name }) => ({ code, name: name.en }))
}

export const getLocationCities = async (countryCode: string): Promise<LocationCity[]> => {
  const response = await fetch(`${LOCATION_ASSETS_PATH}/cities/${countryCode}.json`)

  if (!response.ok) {
    throw new Error('Failed to load cities')
  }

  return (await response.json()) as LocationCity[]
}

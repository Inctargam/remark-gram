import type { LocationCity, LocationCountry } from '@/entities/location'

const LOCATION_ASSETS_PATH = '/locations/v1'

export const getLocationCountries = async (): Promise<LocationCountry[]> => {
  const response = await fetch(`${LOCATION_ASSETS_PATH}/countries.json`)

  if (!response.ok) {
    throw new Error('Failed to load countries')
  }

  return (await response.json()) as LocationCountry[]
}

export const getLocationCities = async (countryCode: string): Promise<LocationCity[]> => {
  const response = await fetch(`${LOCATION_ASSETS_PATH}/cities/${countryCode}.json`)

  if (!response.ok) {
    throw new Error('Failed to load cities')
  }

  return (await response.json()) as LocationCity[]
}

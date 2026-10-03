import { useQuery } from '@tanstack/react-query'

import { getLocationCities, getLocationCountries } from './locationApi'
import { locationQueryKeys } from './locationQueryKeys'

export const useCountriesQuery = (term = '', enabled = true) =>
  useQuery({
    queryKey: locationQueryKeys.countries(term),
    queryFn: () => getLocationCountries(term),
    enabled,
    retry: false,
    staleTime: Infinity,
  })

export const useCitiesQuery = (countryCode: string | null) =>
  useQuery({
    queryKey: locationQueryKeys.cities(countryCode ?? ''),
    queryFn: () => getLocationCities(countryCode ?? ''),
    enabled: Boolean(countryCode),
    retry: false,
    staleTime: Infinity,
  })

import { useQuery } from '@tanstack/react-query'

import { getLocationCities, getLocationCountries } from './locationApi'
import { locationQueryKeys } from './locationQueryKeys'

export const useCountriesQuery = () =>
  useQuery({
    queryKey: locationQueryKeys.countries(),
    queryFn: getLocationCountries,
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

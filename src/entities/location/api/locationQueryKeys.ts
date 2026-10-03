export const locationQueryKeys = {
  all: ['locations'] as const,
  countries: (term = '') => [...locationQueryKeys.all, 'countries', term] as const,
  cities: (countryCode: string) => [...locationQueryKeys.all, 'cities', countryCode] as const,
}

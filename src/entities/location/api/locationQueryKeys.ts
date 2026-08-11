export const locationQueryKeys = {
  all: ['locations'] as const,
  countries: () => [...locationQueryKeys.all, 'countries'] as const,
  cities: (countryCode: string) => [...locationQueryKeys.all, 'cities', countryCode] as const,
}
